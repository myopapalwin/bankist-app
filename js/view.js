export const UI = {
  app: {
    container: document.querySelector(".app"),
  },
  loading: {
    container: document.querySelector(".spinner"),
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
  register: {
    container: document.querySelector(".register"),
    form: document.querySelector(".register_form"),
    ownername: document.getElementById("register__ownername"),
    password: document.getElementById("register__password"),
    confirmPass: document.getElementById("register__confirm_password"),
    rate: document.getElementById("register__input_rate"),
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
  modal: {
    container: document.querySelector(".modal"),
    modalClose: document.querySelector(".close-modal"),
    overlay: document.querySelector(".overlay"),
    error: document.querySelector(".error"),
  },
};

UI.movements.container.innerHTML = "";

export const view = {
  showApp() {
    // UI.app.container.style.opacity = 100;
    UI.app.container.classList.remove("hidden");
    UI.register.container.classList.add("hidden");
  },

  showLoading() {
    UI.loading.container.classList.remove("hidden");
  },

  hideLoading() {
    UI.loading.container.classList.add("hidden");
  },

  showSuccess(account) {
    UI.slogan.welcome.textContent = `Welcome back, ${account.owner}`;
    UI.app.container.classList.remove("hidden");
  },

  showLoginError(errors) {
    errors.forEach((error) => {
      UI.slogan.welcome.textContent = `${error.message}`;
    });
  },

  clearLoginError() {
    UI.slogan.welcome.textContent = "";
  },

  renderErrors(errors) {
    errors.forEach((error) => {
      document.querySelector(`[data-error="${error.field}"]`).textContent =
        error.message;
    });
  },

  clearRegisterErrors() {
    document.querySelectorAll("[data-error]").forEach((el) => {
      el.textContent = "";
    });
  },

  showModal(errors) {
    UI.modal.container.classList.remove("hidden");
    UI.modal.overlay.classList.remove("hidden");
    errors.forEach((error) => {
      UI.modal.error.textContent = error;
    });
  },

  closeModal() {
    UI.modal.container.classList.add("hidden");
    UI.modal.overlay.classList.add("hidden");
  },

  showMovements(movements) {
    UI.movements.container.innerHTML = "";

    movements.forEach((movement, i) => {
      // const type = movement > 0 ? "deposit" : "withdrawal";
      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movement.type}">${
          i + 1
        } ${movement.type}</div>
        <div class="movements__value">${movement.amount} USD</div>
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

  showLoggedOutState() {
    UI.slogan.welcome.textContent = `Login to get started`;
    UI.movements.container.innerHTML = "";
    UI.register.container.innerHTML = "";
    UI.balance.value.textContent = `0 USD`;
    UI.summary.in.textContent = `0 USD`;
    UI.summary.out.textContent = `0 USD`;
    UI.summary.interest.textContent = `0 USD`;
    UI.app.container.classList.add("hidden");
    // UI.app.container.style.opacity = 0;
  },

  getRegisterFormData() {
    return {
      ownername: UI.register.ownername.value,
      password: UI.register.password.value,
      confirmPass: UI.register.confirmPass.value,
      rate: UI.register.rate.value,
    };
  },

  getLoginFormData() {
    return {
      username: UI.login.user.value,
      password: UI.login.pin.value,
    };
  },
};
