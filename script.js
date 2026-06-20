"use strict";

// =====================
// DOM ELEMENTS (Feature-Based)
// =====================
const UI = {
  app: {
    container: document.querySelector(".app"),
  },
  slogon: {
    welcome: document.querySelector(".welcome"),
  },
  balance: {
    value: document.querySelector(".balance__value"),
    date: document.querySelector(".date"),
  },
  movements: {
    container: document.querySelector(".movements"),
  },
  summary: {
    in: document.querySelector(".summary__value--in"),
    out: document.querySelector(".summary__value--out"),
    interest: document.querySelector(".summary__value--interest"),
    btnSort: document.querySelector(".btn--sort"),
  },
  login: {
    form: document.querySelector(".login"),
    user: document.querySelector(".login__input--user"),
    pin: document.querySelector(".login__input--pin"),
    btn: document.querySelector(".login__btn"),
  },
  transfer: {
    form: document.querySelector(".form--transfer"),
    to: document.querySelector(".form__input--to"),
    amount: document.querySelector(".form__input--amount"),
    btn: document.querySelector(".form__btn--transfer"),
  },
  loan: {
    form: document.querySelector(".form--loan"),
    amount: document.querySelector(".form__input--loan-amount"),
    btn: document.querySelector(".form__btn--loan"),
  },
  close: {
    form: document.querySelector(".form--close"),
    user: document.querySelector(".form__input--user"),
    pin: document.querySelector(".form__input--pin"),
    btn: document.querySelector(".form__btn--close"),
  },
  timer: {
    label: document.querySelector(".timer"),
  },
};

// =========================
// MODEL (DATA LAYER)
// =========================
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  interestRate: 1.2,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const state = {
  currentAccount: null,
  isSorted: true,
  accounts: [account1, account2, account3, account4],
};

// Helper
const normalize = (str) => str.trim().toLowerCase();

// Create user name
const createUserName = (name) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((n) => n[0])
    .join("");
};

state.accounts.forEach((account) => {
  account.userName = createUserName(account.owner);
});

const calculateBalance = (movements) => {
  console.log(movements);
  const sum = movements.reduce((acc, cur) => acc + cur, 0);
  console.log(sum);
  return sum;
};

const calculateInOut = (movements, filterFn) =>
  movements.filter(filterFn).reduce((acc, cur) => acc + cur, 0);

// const totalDeposit = (movements) => {
//   const res = movements
//     .filter((mov) => mov >= 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   console.log(res);
//   return res;
// };

// const totalWidthdraw = (movements) => {
//   const res = movements
//     .filter((mov) => mov < 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   console.log(res);
//   return res;
// };

const model = {
  canTransfer(sender, receiver, bal, amt) {
    return receiver && sender && receiver != sender && amt > 0 && bal >= amt;
  },
  transferMoney(sender, receiver, amt) {
    sender.movements.push(-amt);
    receiver.movements.push(amt);
  },
  isCurrentAccount(user, pin, currentAccount) {
    return (
      currentAccount.userName === user && pin && pin === currentAccount.pin
    );
  },
  sorting(movements) {
    return [...movements].sort((a, b) => a - b);
  },
};

// =========================
// VIEW RENDER (UI LAYER)
// =========================
UI.movements.container.innerHTML = "";

const view = {
  showSuccess(account) {
    UI.slogon.welcome.textContent = `Welcome back, ${account.owner}`;
  },

  showError(message) {
    UI.slogon.welcome.textContent = `${message}`;
  },

  clearInput() {
    UI.login.user.value = "";
    UI.login.pin.value = "";
    // UI.movements.container.innerHTML = "";
  },

  clearTransferInputs() {
    UI.transfer.to.value = "";
    UI.transfer.amount.value = "";
  },

  clearLoanInputs() {
    UI.loan.amount.value = "";
  },

  clearCloseAccountInputs() {
    UI.close.user.value = "";
    UI.close.pin.value = "";
  },

  showMovements(movements) {
    UI.movements.container.innerHTML = "";

    movements.forEach((movement, i) => {
      const type = movement > 0 ? "deposit" : "withdrawal";
      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
        <div class="movements__value">${movement} USD</div>
      </div>
            `;

      UI.movements.container.insertAdjacentHTML("afterbegin", html);
    });
  },

  showCurrentBalnce(balance) {
    console.log("rendering", balance);
    UI.balance.value.textContent = `${balance} USD`;
  },

  showTotalDeposit(value) {
    UI.summary.in.textContent = `${Math.abs(value)} USD`;
  },

  showTotalWidthdraw(value) {
    UI.summary.out.textContent = `${Math.abs(value)} USD`;
  },

  showInterest(deposit, value) {
    UI.summary.interest.textContent = (deposit * value) / 100;
  },
};

// =========================
// CONTROLLER (LOGIC LAYER)
// =========================
const authController = (() => {
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
  };

  const validPin = (account, inputPin) => {
    return account.pin === Number(inputPin);
  };

  const login = (user, pin) => {
    const acc = findAccount(user);
    console.log(acc);

    if (!user || !pin) {
      UI.app.container.style.opacity = 0;
      return view.showError("Please input user and password");
    }

    if (!acc) {
      UI.app.container.style.opacity = 0;
      return view.showError("User not found!");
    }

    if (!validPin(acc, pin)) {
      UI.app.container.style.opacity = 0;
      return view.showError("Invalid Pin !");
    }

    state.currentAccount = acc;

    view.showSuccess(acc);

    view.showMovements(acc.movements);

    // calculating balance
    const balance = calculateBalance(acc.movements);
    view.showCurrentBalnce(balance);

    // calculating deposit
    const deposit = calculateInOut(acc.movements, (mov) => mov >= 0);
    view.showTotalDeposit(deposit);

    // calculating withdraw
    const widthdraw = calculateInOut(acc.movements, (mov) => mov < 0);
    view.showTotalWidthdraw(widthdraw);

    view.showInterest(deposit, 1.1);

    UI.app.container.style.opacity = 100;

    view.clearInput();
  };

  const transfer = (rec, amt) => {
    const sender = state.currentAccount;
    const receiver = findAccount(rec);

    // Balance before transfer
    const currentBalance = calculateBalance(sender.movements);
    const amount = Number(amt);

    if (!model.canTransfer(sender, receiver, currentBalance, amount)) {
      view.showError("Cannot Transfer!, please try again later");
      return; // Function stop;
    }

    model.transferMoney(sender, receiver, amount);

    view.showMovements(sender.movements);

    // Balance after transfer
    const updateBalance = calculateBalance(sender.movements);
    view.showCurrentBalnce(updateBalance);

    // calculating deposit
    const deposit = calculateInOut(sender.movements, (mov) => mov >= 0);
    view.showTotalDeposit(deposit);

    // calculating withdraw
    const widthdraw = calculateInOut(sender.movements, (mov) => mov < 0);
    view.showTotalWidthdraw(widthdraw);

    view.clearTransferInputs();

    console.log(sender, receiver, currentBalance, amount);
  };

  const loan = (amt) => {
    const currentAcc = state.currentAccount;
    const loanAmt = Number(amt);

    // Update Movements
    currentAcc.movements.push(loanAmt);
    view.showMovements(currentAcc.movements);

    // Update Balance
    const balance = calculateBalance(currentAcc.movements);
    view.showCurrentBalnce(balance);

    // Update In/Out
    const inAmt = calculateInOut(currentAcc.movements, (mov) => mov >= 0);
    view.showTotalDeposit(inAmt);

    const outAmt = calculateInOut(currentAcc.movements, (mov) => mov < 0);
    view.showTotalWidthdraw(outAmt);
    console.log(inAmt, outAmt);

    // Clear form input
    view.clearLoanInputs();
  };

  const closeAccount = (user, pin) => {
    const usr = normalize(user);
    const pinNumber = Number(pin);
    const currentAccount = state.currentAccount;
    const isCorrect = model.isCurrentAccount(usr, pinNumber, currentAccount);
    if (isCorrect) {
      UI.app.container.style.opacity = 0;
    }

    // Clear form input
    view.clearCloseAccountInputs();
  };

  const sortMovements = () => {
    const currentAccount = state.currentAccount;

    const sortResult = state.isSorted
      ? model.sorting(currentAccount.movements)
      : currentAccount.movements;

    view.showMovements(sortResult);
    state.isSorted = !state.isSorted;
  };

  return {
    login,
    transfer,
    loan,
    closeAccount,
    sortMovements,
  };
})();

// =========================
// EVENT
// =========================
UI.login.form.addEventListener("submit", function (e) {
  e.preventDefault();

  const userName = UI.login.user.value;
  const pin = UI.login.pin.value;

  authController.login(userName, pin);
});

UI.transfer.form.addEventListener("submit", function (e) {
  e.preventDefault();
  const reciver = UI.transfer.to.value;
  const amount = UI.transfer.amount.value;

  authController.transfer(reciver, amount);
});

UI.loan.form.addEventListener("submit", function (e) {
  e.preventDefault();
  const amount = UI.loan.amount.value;
  console.log(amount);

  authController.loan(amount);
});

UI.close.form.addEventListener("submit", function (e) {
  e.preventDefault();
  const user = UI.close.user.value;
  const pin = UI.close.pin.value;

  authController.closeAccount(user, pin);
});

UI.summary.btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  authController.sortMovements();
});
