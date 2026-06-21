export const UI = {
  app: {
    container: document.querySelector(".app"),
  },
  slogan: {
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

UI.movements.container.innerHTML = "";

export const view = {
  showApp() {
    UI.app.container.style.opacity = 100;
  },

  hideApp() {
    UI.app.container.style.opacity = 0;
  },

  showSuccess(account) {
    UI.slogan.welcome.textContent = `Welcome back, ${account.owner}`;
  },

  showError(message) {
    UI.slogan.welcome.textContent = `${message}`;
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

  showCurrentBalance(balance) {
    UI.balance.value.textContent = `${balance} USD`;
  },

  showTotalDeposit(value) {
    UI.summary.in.textContent = `${Math.abs(value)} USD`;
  },

  showTotalWithdraw(value) {
    UI.summary.out.textContent = `${Math.abs(value)} USD`;
  },

  showInterest(value) {
    UI.summary.interest.textContent = value;
  },

  clearInput() {
    UI.login.user.value = "";
    UI.login.pin.value = "";
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
};
