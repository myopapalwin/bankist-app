import { model, state } from "./model.js";
import { view, UI } from "./view.js";
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

  login(formData) {
    try {
      view.showLoading();
      state.sortState = false;

      const result = validation.handleLogin(
        formData,
        model.findAccountByUsername,
      );
      // console.log(result);

      view.clearLoginError();

      if (result.error) {
        view.showLoggedOutState();
        view.showLoginError(result.error);
        return; // !important
      }

      state.currentAccount = result.account;

      // Store in memory
      auth.saveUser(result.account);

      view.showSuccess(result.account);

      // Update UI
      controllerHelper.updateUI(result.account);

      view.showApp();

      view.clearInput();
    } catch (error) {
      console.error(error);
    } finally {
      view.hideLoading();
    }
  },

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
      view.showModal(error);
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
};

// =========================
// EVENT
// =========================
const init = async () => {
  try {
    view.showLoading();

    const users = await model.getUserData();
    console.log(users);

    const sessionUser = auth.loadUser();

    if (!sessionUser) return;

    const latestAccount = model.findAccountByUserId(sessionUser.id);
    state.currentAccount = latestAccount;
    controllerHelper.updateUI(latestAccount);
    view.showSuccess(latestAccount);
    view.showApp();

    UI.register.form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = view.getRegisterFormData();
      accountController.createAccount(formData);
    });

    UI.login.form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = view.getLoginFormData();
      accountController.login(formData);
    });

    UI.transfer.form.addEventListener("submit", function (e) {
      e.preventDefault();
      const reciver = UI.transfer.to.value;
      const amount = UI.transfer.amount.value;

      accountController.transfer(reciver, amount);
    });

    UI.loan.form.addEventListener("submit", function (e) {
      e.preventDefault();
      const amount = UI.loan.amount.value;
      accountController.loan(amount);
    });

    UI.close.form.addEventListener("submit", function (e) {
      e.preventDefault();
      const user = UI.close.user.value;
      const pin = UI.close.pin.value;

      accountController.closeAccount(user, pin);
    });

    UI.summary.btnSort.addEventListener("click", function (e) {
      e.preventDefault();

      accountController.sortMovements();
    });

    UI.modal.modalClose.addEventListener("click", function (e) {
      e.preventDefault();
      view.closeModal();
    });

    UI.logout.link.addEventListener("click", function (e) {
      console.log("hi");
      e.preventDefault();

      auth.removeUser();
      view.showLoggedOutState;
    });
  } catch (error) {
    console.error(error);
  } finally {
    view.hideLoading();
  }
};

init();
