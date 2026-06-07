"use strict";

// App container
// const appContainer = document.querySelector(".app");

// Balance
// const balanceValue = document.querySelector(".balance__value");
// const balanceDate = document.querySelector(".date");

// Movements
// const containerMovements = document.querySelector(".movements");

// Summary
// const summaryIn = document.querySelector(".summary__value--in");
// const summaryOut = document.querySelector(".summary__value--out");
// const summaryInterest = document.querySelector(".summary__value--interest");
// const btnSort = document.querySelector(".btn--sort");

// Login
// const loginForm = document.querySelector(".login");
// const inputLoginUser = document.querySelector(".login__input--user");
// const inputLoginPin = document.querySelector(".login__input--pin");
// const btnLogin = document.querySelector(".login__btn");

// Transfer
// const transferForm = document.querySelector(".form--transfer");
// const inputTransferTo = document.querySelector(".form__input--to");
// const inputTransferAmount = document.querySelector(".form__input--amount");
// const btnTransfer = document.querySelector(".form__btn--transfer");

// Loan
// const loanForm = document.querySelector(".form--loan");
// const inputLoanAmount = document.querySelector(".form__input--loan-amount");
// const btnLoan = document.querySelector(".form__btn--loan");

// Close account
// const closeForm = document.querySelector(".form--close");
// const inputCloseUser = document.querySelector(".form__input--user");
// const inputClosePin = document.querySelector(".form__input--pin");
// const btnClose = document.querySelector(".form__btn--close");

// Timer
// const labelTimer = document.querySelector(".timer");

// =====================
// DOM ELEMENTS (Feature-Based)
// =====================

const UI = {
  app: {
    container: document.querySelector(".app"),
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

// =====================
// MVC Thinking (Simple)
// =====================

// ====== Model (Data) =======
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
  accounts: [account1, account2, account3, account4],
};

// ====== View Render (UI update functions) ======
const displayMovement = function (movements) {
  UI.movements.container.innerHTML = "";

  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    UI.movements.container.insertAdjacentHTML("afterbegin", html);
  });
};

displayMovement(account1.movements);

// ========= Controller =========== //
// const handleLogin = function (e) {
//   e.preventDefault();

//   const inputUserName = UI.login.user.value;
//   const inputPin = Number(UI.login.pin.value);

//   const currentUser = state.accounts.find((acc) => {
//     acc.owner.toLowerCase().includes(inputUserName) && acc.pin === inputPin;
//   });

//   if (currentUser) {
//     console.log("Actual user");
//   } else {
//     console.log("You are not register");
//   }
// };

const handleLogin = function (e) {
  e.preventDefault();

  const user = UI.login.user.value;
  const pin = Number(UI.login.pin.value);

  const account = state.accounts.find(
    (acc) => acc.owner.includes(user) && acc.pin === pin,
  );

  if (account) {
    state.currentAccount = account;

    displayMovement(account.movements);
    UI.app.container.style.opacity = 1;
  }
};

UI.login.form.addEventListener("submit", handleLogin);
