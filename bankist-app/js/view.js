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
  // balance: {
  //   value: document.querySelector(".balance__value"),
  //   date: document.querySelector(".date"),
  // },
  // movements: {
  //   container: document.querySelector(".movements"),
  // },
  // summary: {
  //   in: document.querySelector(".summary__value--in"),
  //   out: document.querySelector(".summary__value--out"),
  //   interest: document.querySelector(".summary__value--interest"),
  //   btnSort: document.querySelector(".btn--sort"),
  // },
  // register: {
  //   // container: document.querySelector(".register"),
  //   form: document.querySelector(".register_form"),
  //   firstName: document.querySelector(".register__firstname"),
  //   lastName: document.querySelector(".register__lastname"),
  //   password: document.querySelector(".register__password"),
  //   confirmPass: document.querySelector(".register__confirm_password"),
  //   balance: document.querySelector(".register__balance"),
  //   rate: document.querySelector(".register__input_rate"),
  // },

  // login: {
  //   form: document.querySelector(".login-form"),
  //   user: document.querySelector(".login__input--user"),
  //   pin: document.querySelector(".login__input--pin"),
  //   btn: document.querySelector(".login__btn"),
  // },

  // transfer: {
  //   form: document.querySelector(".form--transfer"),
  //   to: document.querySelector(".form__input--to"),
  //   amount: document.querySelector(".form__input--amount"),
  //   btn: document.querySelector(".form__btn--transfer"),
  // },

  // loan: {
  //   form: document.querySelector(".form--loan"),
  //   amount: document.querySelector(".form__input--loan-amount"),
  //   btn: document.querySelector(".form__btn--loan"),
  // },
  // close: {
  //   form: document.querySelector(".form--close"),
  //   user: document.querySelector(".form__input--user"),
  //   pin: document.querySelector(".form__input--pin"),
  //   btn: document.querySelector(".form__btn--close"),
  // },
  timer: {
    label: document.querySelector(".timer"),
  },
  // modal: {
  //   container: document.querySelector(".modal"),
  //   modalClose: document.querySelector(".close-modal"),
  //   overlay: document.querySelector(".overlay"),
  //   error: document.querySelector(".error"),
  // },
  logout: {
    button: document.querySelector(".logout"),
  },
};

UI.movements.container.innerHTML = "";

export const view = {
  showApp() {
    UI.app.container.classList.remove("hidden");
    // UI.register.container.classList.add("hidden");
    // UI.login.form.classList.add("hidden");
    UI.logout.button.classList.remove("hidden");
  },

  // showLoading() {
  //   UI.loading.container.classList.remove("hidden");
  // },

  // hideLoading() {
  //   UI.loading.container.classList.add("hidden");
  // },

  showSuccess(account) {
    UI.slogan.welcome.textContent = `Welcome back, ${account.owner}`;
    // UI.app.container.classList.remove("hidden");
  },

  // showLoginError(error) {
  //   UI.slogan.welcome.textContent = `${error.message}`;
  // },

  // clearLoginError() {
  //   UI.slogan.welcome.textContent = "";
  // },

  // renderErrors(errors) {
  //   errors.forEach((error) => {
  //     document.querySelector(`[data-error="${error.field}"]`).textContent =
  //       error.message;
  //   });
  // },

  // clearRegisterErrors() {
  //   document.querySelectorAll("[data-error]").forEach((el) => {
  //     el.textContent = "";
  //   });
  // },

  // showModal(message) {
  //   UI.modal.container.classList.remove("hidden");
  //   UI.modal.overlay.classList.remove("hidden");
  //   UI.modal.error.textContent = message;
  // },

  // closeModal() {
  //   UI.modal.container.classList.add("hidden");
  //   UI.modal.overlay.classList.add("hidden");
  // },

  // showMovements(movements) {
  //   UI.movements.container.innerHTML = "";

  //   movements.forEach((movement, i) => {
  //     // const type = movement > 0 ? "deposit" : "withdrawal";
  //     const html = `
  //     <div class="movements__row">
  //       <div class="movements__type movements__type--${movement.type}">${
  //         i + 1
  //       } ${movement.type}</div>
  //       <div class="movements__value">${movement.amount} USD</div>
  //     </div>
  //           `;

  //     UI.movements.container.insertAdjacentHTML("afterbegin", html);
  //   });
  // },

  // renderSummary(summary) {
  //   UI.balance.value.textContent = `${summary.balance} USD`;
  //   UI.summary.in.textContent = `${Math.abs(summary.deposit)} USD`;
  //   UI.summary.out.textContent = `${Math.abs(summary.withdraw)} USD`;
  //   UI.summary.interest.textContent = summary.interest;
  // },

  // clearLoginInput() {
  //   UI.login.user.value = "";
  //   UI.login.pin.value = "";
  // },

  // clearTransferInputs() {
  //   UI.transfer.to.value = "";
  //   UI.transfer.amount.value = "";
  // },

  // clearLoanInputs() {
  //   UI.loan.amount.value = "";
  // },

  clearCloseAccountInputs() {
    UI.close.user.value = "";
    UI.close.pin.value = "";
  },

  showLoggedOutState() {
    UI.slogan.welcome.textContent = `Login to get started`;
    UI.balance.value.textContent = `0 USD`;
    UI.summary.in.textContent = `0 USD`;
    UI.summary.out.textContent = `0 USD`;
    UI.summary.interest.textContent = `0 USD`;
    // UI.app.container.classList.add("hidden");
    // UI.register.container.classList.remove("hidden");
    // UI.login.form.classList.remove("hidden");
    UI.logout.button.classList.add("hidden");
  },

  // getRegisterFormData() {
  //   return {
  //     firstName: UI.register.firstName.value,
  //     lastName: UI.register.lastName.value,
  //     password: UI.register.password.value,
  //     confirmPass: UI.register.confirmPass.value,
  //     balance: UI.register.balance.value,
  //     rate: UI.register.rate.value,
  //   };
  // },

  // getLoginFormData() {
  //   return {
  //     username: UI.login.user.value,
  //     password: UI.login.pin.value,
  //   };
  // },

  // Events
  // bindRegister(handler) {
  //   UI.register.form.addEventListener("submit", (e) => {
  //     e.preventDefault();

  //     handler(this.getRegisterFormData());
  //   });
  // },
  // bindLogin(handler) {
  //   UI.login.form.addEventListener("submit", (e) => {
  //     console.log("Login click");
  //     e.preventDefault();

  //     handler(this.getLoginFormData());
  //   });
  // },
  bindLogout(handler) {
    UI.logout.button.addEventListener("click", (e) => {
      e.preventDefault();

      handler();
    });
  },
  // bindTransfer(handler) {
  //   UI.transfer.form.addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     const reciver = UI.transfer.to.value;
  //     const amount = UI.transfer.amount.value;

  //     handler(reciver, amount);
  //   });
  // },
  bindLoan(handler) {
    UI.loan.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const amount = UI.loan.amount.value;
      handler(amount);
    });
  },
  bindCloseAccount(handler) {
    UI.close.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = UI.close.user.value;
      const pin = UI.close.pin.value;

      handler(user, pin);
    });
  },
  bindSorting(handler) {
    UI.summary.btnSort.addEventListener("click", (e) => {
      e.preventDefault();

      handler();
    });
  },
  bindCloseModal(handler) {
    UI.modal.modalClose.addEventListener("click", (e) => {
      e.preventDefault();
      handler();
    });
  },
};
