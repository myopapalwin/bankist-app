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
// =========================
// VIEW RENDER (UI LAYER)
// =========================
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

  showMovements(movements) {
    UI.movements.container.style.display = "none";

    movements.forEach((movement, i) => {
      console.log(movement);
      const type = movement > 0 ? "deposit" : "withdrawal";
      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
        <div class="movements__value">${movement}€</div>
      </div>
            `;

      UI.movements.container.insertAdjacentHTML("afterbegin", html);
    });
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
      UI.movements.container.style.display = "none";
      return view.showError("Please input user and password");
    }

    if (!acc) {
      UI.movements.container.style.display = "none";
      return view.showError("User not found!");
    }

    if (!validPin(acc, pin)) {
      UI.movements.container.style.display = "none";
      return view.showError("Invalid Pin !");
    }

    state.currentAccount = acc;

    view.showSuccess(acc);

    view.showMovements(acc.movements);

    UI.movements.container.style.display = "block";

    view.clearInput();
  };

  return {
    login,
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
