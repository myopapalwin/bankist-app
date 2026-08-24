import { baseView } from "./baseView.js";

const UI = {
  register: {
    form: document.querySelector(".register_form"),
    ownerName: document.querySelector(".register__ownername"),
    username: document.querySelector(".register__username"),
    password: document.querySelector(".register__password"),
    confirmPass: document.querySelector(".register__confirm_password"),
    balance: document.querySelector(".register__balance"),
    rate: document.querySelector(".register__input_rate"),
    button: document.querySelector(".register__btn"),
  },
};

export const registerView = {
  ...baseView,

  disableSubmit() {
    UI.register.button.disabled = true;
  },

  enableSubmit() {
    UI.register.button.disabled = false;
  },

  getRegisterFormData() {
    return {
      ownerName: UI.register.ownerName.value,
      username: UI.register.username.value,
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
    UI.register.ownerName.value = "";
    UI.register.username.value = "";
    UI.register.password.value = "";
    UI.register.confirmPass.value = "";
    UI.register.balance.value = "";
  },
};
