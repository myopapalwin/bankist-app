import { model, state } from "./model.js";
import { view } from "./view.js";
import { normalizeName, auth } from "./helper.js";
import { validation } from "./validation.js";

const controllerHelper = {
  updateUI(account) {
    view.showMovements(account.movements);

    const summary = model.getAccountSummary(account);
    view.renderSummary(summary); // get total value
  },
};

export const accountController = {
  async createAccount(formData) {
    try {
      const errors = validation.handleRegister(formData);

      view.clearRegisterErrors();

      if (errors.length) {
        console.log(errors.length);
        view.renderErrors(errors);
        return;
      }

      return await model.createUserData(formData);
    } catch (error) {
      console.error(error);
    }
  },

  // login(formData) {
  //   try {
  //     view.showLoading();
  //     state.sortState = false;

  //     const result = validation.handleLogin(
  //       formData,
  //       model.findAccountByUsername,
  //     );

  //     view.clearLoginError();

  //     if (result.error) {
  //       view.showLoggedOutState();
  //       view.showLoginError(result.error);
  //       return; // !important
  //     }

  //     state.currentAccount = result.account;

  //     // Store in memory
  //     auth.saveUser(result.account);

  //     view.showSuccess(result.account);

  //     // Update UI
  //     controllerHelper.updateUI(result.account);

  //     view.showApp();

  //     view.clearLoginInput();
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     view.hideLoading();
  //   }
  // },

  async transfer(username, amt) {
    try {
      view.showLoading();

      const sender = state.currentAccount;

      // Balance before transfer
      const currentBalance = model.calculateBalance(sender.movements);
      const amount = Number(amt);

      const result = validation.validateTransfer(
        amount,
        sender,
        username,
        model.findAccountByUsername,
        currentBalance,
      );

      if (result.error) {
        view.clearTransferInputs();
        view.showModal(result.error.message);
        return;
      }

      const receiver = result.receiver;

      model.transferMoney(sender, receiver, amount);

      await Promise.all([
        model.updateUserMovements(sender),
        model.updateUserMovements(receiver),
      ]);

      // // Update UI
      controllerHelper.updateUI(sender);

      view.clearTransferInputs();
    } catch (error) {
      console.error(error);
    } finally {
      view.hideLoading();
    }
  },

  async loan(amt) {
    try {
      view.showLoading();
      const currentAcc = state.currentAccount;
      const loanAmt = Number(amt);
      const deposit = model.calculateDeposit(currentAcc.movements);

      const error = validation.validateLoanMoney(deposit, loanAmt, currentAcc);
      console.log(error);

      if (error) {
        view.showModal(error.message);
        return;
      }
      model.loanMoney(loanAmt, currentAcc);

      await model.updateUserMovements(currentAcc);

      // Update UI
      controllerHelper.updateUI(currentAcc);

      // Clear form input
      view.clearLoanInputs();
    } catch (error) {
      console.error(error);
    } finally {
      view.hideLoading();
    }
  },

  async closeAccount(user, pin) {
    const usr = normalizeName(user);
    const pinNumber = Number(pin);
    const currentAccount = state.currentAccount;

    const error = validation.isCurrentUser(usr, pinNumber, currentAccount);
    console.log(error);

    if (error) {
      view.showModal(error.message);
      return;
    }

    await model.deleteCurrentUser(currentAccount.id);

    state.currentAccount = null;

    view.showLoggedOutState();

    view.clearCloseAccountInputs();
  },

  sortMovements() {
    const currentAccount = state.currentAccount;

    const sortResult = state.sortState
      ? currentAccount.movements
      : model.sorting(currentAccount.movements);

    view.showMovements(sortResult);
    state.sortState = !state.sortState;
  },

  logout() {
    auth.removeUser();
    state.currentAccount = null;
    view.showLoggedOutState();
  },

  closeModal() {
    view.closeModal();
  },
};

// =========================
// EVENT
// =========================
function bindEvents() {
  view.bindRegister(accountController.createAccount);

  // view.bindLogin(accountController.login);

  view.bindTransfer(accountController.transfer);

  view.bindLoan(accountController.loan);

  view.bindLogout(accountController.logout);

  view.bindCloseAccount(accountController.closeAccount);

  view.bindSorting(accountController.sortMovements);

  view.bindCloseModal(accountController.closeModal);
}

const init = async () => {
  try {
    view.showLoading();

    const users = await model.loadUsers();
    console.log(users);

    bindEvents();

    const sessionUser = auth.loadUser();

    if (sessionUser) {
      const latestAccount = model.findAccountByUserId(sessionUser.id);
      state.currentAccount = latestAccount;
      controllerHelper.updateUI(latestAccount);
      view.showSuccess(latestAccount);
      view.showApp();
    }
  } catch (error) {
    console.error(error);
  } finally {
    view.hideLoading();
  }
};

init();
