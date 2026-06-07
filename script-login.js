const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
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

// =========================
// MODEL
// =========================

// reusable normalize helper
const normalize = (str) => str.trim().toLowerCase();

// generate username from owner name
// "Steven Thomas Williams" -> "stw"
const createUsername = (owner) =>
  owner
    .toLowerCase()
    .split(" ")
    .map((name) => name[0])
    .join("");

// attach username to each account
state.accounts.forEach((acc) => {
  acc.username = createUsername(acc.owner);
  console.log(acc.username);
});

// =========================
// VIEW
// =========================

const elements = {
  form: document.querySelector(".login"),
  inputUser: document.querySelector(".login__input--user"),
  inputPin: document.querySelector(".login__input--pin"),
  welcome: document.querySelector(".welcome"),
};

const view = {
  showSuccess(account) {
    elements.welcome.textContent = `Welcome back, ${account.owner}`;
  },

  showError(message) {
    elements.welcome.textContent = message;
  },

  clearInputs() {
    elements.inputUser.value = "";
    elements.inputPin.value = "";
    elements.inputPin.blur();
  },
};

// =========================
// CONTROLLER
// =========================

const authController = (() => {
  // private helper
  const findAccount = (username) => {
    const normalizedInput = normalize(username); // user input
    console.log(normalizedInput);

    // Find user name first
    const userNameMatch = state.accounts.find((acc) => {
      return normalize(acc.username) === normalizedInput;
    });

    if (userNameMatch) return userNameMatch;

    // If user name is not exit, find owner name
    return state.accounts.find((acc) => {
      return normalize(acc.owner).includes(normalizedInput);
    });
  };

  const validatePin = (account, pin) => {
    return account.pin === Number(pin);
  };

  const login = (username, pin) => {
    // basic guard clause
    if (!username || !pin) {
      return view.showError("Please enter credentials");
    }

    const account = findAccount(username);

    // account not found
    if (!account) {
      return view.showError("User not found");
    }

    // invalid pin
    if (!validatePin(account, pin)) {
      return view.showError("Incorrect PIN");
    }

    // save current logged in user
    state.currentAccount = account;

    // update UI
    view.showSuccess(account);

    console.log("Logged in user:", account);

    view.clearInputs();
  };

  // public API
  return {
    login,
  };
})();

// =========================
// EVENT
// =========================

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = elements.inputUser.value;
  const pin = elements.inputPin.value;

  authController.login(username, pin);
});
