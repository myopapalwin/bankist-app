import { model, state } from "./model.js";
import { view, UI } from "./view.js";
import { normalize } from "./helper.js";

const findAccount = (userInputName) => {
  const normalizeName = normalize(userInputName); // call

  // Find user name
  const findUserName = state.accounts.find((account) => {
    // loop and find in api array
    const userName = normalize(account.userName);
    return userName === normalizeName;
  });

  if (findUserName) return findUserName;

  // Find owner name
  const findOwnerName = state.accounts.find((account) => {
    const ownerName = normalize(account.owner);
    return ownerName.includes(normalizeName);
  });

  return findOwnerName;
};

const validPin = (account, inputPin) => {
  return account.pin === Number(inputPin);
};

const updateUI = (account) => {
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
};

export const accountController = {
  login(user, pin) {
    state.sortState = false;

    const acc = findAccount(user);

    if (!user || !pin) {
      view.hideApp();
      return view.showError("Please input user and password");
    }

    if (!acc) {
      view.hideApp();
      return view.showError("User not found!");
    }

    if (!validPin(acc, pin)) {
      view.hideApp();
      return view.showError("Invalid Pin !");
    }

    state.currentAccount = acc;

    view.showSuccess(acc);

    // Update UI
    updateUI(acc);

    view.showApp();

    view.clearInput();
  },

  transfer(rec, amt) {
    const sender = state.currentAccount;
    const receiver = findAccount(rec);

    // Balance before transfer
    const currentBalance = model.calculateBalance(sender.movements);
    const amount = Number(amt);

    if (!model.canTransfer(sender, receiver, currentBalance, amount)) {
      view.showError("Cannot Transfer!, please try again later");
      return; // Function stop;
    }

    model.transferMoney(sender, receiver, amount);

    // Update UI
    updateUI(sender);

    view.clearTransferInputs();
  },

  loan(amt) {
    const currentAcc = state.currentAccount;
    const loanAmt = Number(amt);
    const deposit = model.calculateTotalDeposit(currentAcc.movements);

    // Bankist rule
    if (deposit >= loanAmt * 0.1) {
      currentAcc.movements.push(loanAmt);
    }

    // Update UI
    updateUI(currentAcc);

    // Clear form input
    view.clearLoanInputs();
  },

  closeAccount(user, pin) {
    const usr = normalize(user);
    const pinNumber = Number(pin);
    const currentAccount = state.currentAccount;
    const isCorrect = model.isCurrentAccount(usr, pinNumber, currentAccount);
    if (isCorrect) {
      const index = state.accounts.findIndex((acc) => acc === currentAccount);
      state.accounts.splice(index, 1);
      view.hideApp();
    }

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
const init = () => {
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
};

init();
