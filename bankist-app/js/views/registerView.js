import { baseView } from "./baseView.js";

const UI = {
  loading: { container: document.querySelector(".overlay") },
  register: {
    success: document.querySelector(".register_success"),
    form: document.querySelector(".register_form"),
    firstName: document.querySelector(".register__firstname"),
    lastName: document.querySelector(".register__lastname"),
    password: document.querySelector(".register__password"),
    confirmPass: document.querySelector(".register__confirm_password"),
    balance: document.querySelector(".register__balance"),
    rate: document.querySelector(".register__input_rate"),
    button: document.querySelector(".register__btn"),
  },
};

export const registerView = {
  ...baseView,

  showLoading() {
    UI.loading.container.classList.remove("hidden");
  },

  hideLoading() {
    UI.loading.container.classList.add("hidden");
  },

  disableSubmit() {
    UI.register.button.disabled = true;
  },

  enableSubmit() {
    UI.register.button.disabled = false;
  },

  showSuccess() {
    UI.register.success.classList.remove("hidden");
  },

  getRegisterFormData() {
    return {
      firstName: UI.register.firstName.value,
      lastName: UI.register.lastName.value,
      password: UI.register.password.value,
      confirmPass: UI.register.confirmPass.value,
      balance: UI.register.balance.value,
      rate: UI.register.rate.value,
    };
  },

  bindEventRegister(handler) {
    UI.register.form.addEventListener("submit", (e) => {
      e.preventDefault();

      handler(this.getRegisterFormData());
    });
  },

  clearFormInput() {
    UI.register.firstName.value = "";
    UI.register.lastName.value = "";
    UI.register.password.value = "";
    UI.register.confirmPass.value = "";
    UI.register.balance.value = "";
  },
};
