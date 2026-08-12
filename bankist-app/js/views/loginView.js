import { baseView } from "./baseView.js";
const UI = {
  login: {
    form: document.querySelector(".login-form"),
    user: document.querySelector(".login__input--user"),
    pin: document.querySelector(".login__input--pin"),
    btn: document.querySelector(".login__btn"),
  },
};

export const loginView = {
  ...baseView,

  getLoginFormData() {
    return {
      username: UI.login.user.value,
      password: UI.login.pin.value,
    };
  },

  bindLogin(handler) {
    UI.login.form.addEventListener("submit", (e) => {
      e.preventDefault();

      handler(this.getLoginFormData());
    });
  },

  clearFormInput() {
    UI.login.user.value = "";
    UI.login.pin.value = "";
  },
};
