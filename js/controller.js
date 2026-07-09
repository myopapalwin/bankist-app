import { model, state } from "./model.js";
import { view, UI } from "./view.js";
import { normalizeName } from "./helper.js";
import { validation } from "./validation.js";

const controllerHelper = {
  updateUI(account) {
    view.showMovements(account.movements);

    // calculating balance
    const balance = model.calculateBalance(account.movements);
    view.showCurrentBalance(balance);

    // calculating deposit
    const deposit = model.calculateTotalDeposit(account.movements);
    view.showTotalDeposit(deposit);

    // calculating withdraw
    const withdraw = model.calculateTotalWithdraw(account.movements);
    view.showTotalWithdraw(withdraw);

    // calculating interest
    const interest = model.calculateInterest(deposit, account.interestRate);
    view.showInterest(interest);
  },
};

export const accountController = {
  async createAccount(formData) {
    // console.log(formData);
    try {
      const errors = validation.handleRegister(formData);
      console.log("Errors: ");
      console.log(errors);

      view.clearErrors();

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

  login(user, pin) {
    try {
      view.showLoading();
      state.sortState = false;

      const acc = model.findAccount(user);

      if (!user || !pin) {
        view.showLoggedOutState();
        return view.showError("Please input user and password");
      }

      if (!acc) {
        view.showLoggedOutState();
        return view.showError("User not found!");
      }

      if (!model.validPin(acc, pin)) {
        view.showLoggedOutState();
        return view.showError("Invalid Pin !");
      }

      state.currentAccount = acc;

      view.showSuccess(acc);

      // Update UI
      controllerHelper.updateUI(acc);

      view.showApp();

      view.clearInput();
    } catch (error) {
      console.error(error);
    } finally {
      view.hideLoading();
    }
  },

  transfer(rec, amt) {
    try {
      view.showLoading();

      const sender = state.currentAccount;
      const receiver = model.findAccount(rec);

      // Balance before transfer
      const currentBalance = model.calculateBalance(sender.movements);
      const amount = Number(amt);

      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        sender === receiver ||
        currentBalance < amount
      ) {
        view.showError("Cannot Transfer!, please try again later");
        return; // Function stop;
      }
      model.transferMoney(sender, receiver, amount);

      // Update UI
      controllerHelper.updateUI(sender);

      view.clearTransferInputs();
    } catch (error) {
      console.error(error);
    } finally {
      view.hideLoading();
    }
  },

  loan(amt) {
    try {
      view.showLoading();
      const currentAcc = state.currentAccount;
      const loanAmt = Number(amt);
      const deposit = model.calculateTotalDeposit(currentAcc.movements);

      model.loanMoney(deposit, loanAmt, currentAcc);

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

  closeAccount(user, pin) {
    const usr = normalizeName(user);
    const pinNumber = Number(pin);
    const currentAccount = state.currentAccount;
    const isCorrect = model.isCurrentAccount(usr, pinNumber, currentAccount);
    if (isCorrect) {
      const index = state.accounts.findIndex((acc) => acc === currentAccount);
      state.accounts.splice(index, 1);
      view.showLoggedOutState();
    }

    state.currentAccount = null;

    // Clear form input
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

    UI.login.form.addEventListener("submit", function (e) {
      e.preventDefault();

      const userName = UI.login.user.value;
      const pin = UI.login.pin.value;

      accountController.login(userName, pin);
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

    UI.register.form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = view.getRegisterFormData();
      accountController.createAccount(formData);
    });
  } catch (error) {
    console.error(error);
  } finally {
    view.hideLoading();
  }
};

init();
