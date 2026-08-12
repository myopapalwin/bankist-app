import { registerView } from "../views/registerView.js";
import { model } from "../model.js";
import { auth, delay } from "../helper.js";
import { validation } from "../validation.js";

export const registerController = {
  async init() {
    registerView.bindEventRegister(registerController.createAccount);
  },

  async createAccount(formData) {
    try {
      const errors = validation.handleRegister(formData);
      console.log(errors);

      registerView.clearErrors();

      if (errors.length) {
        registerView.renderErrors(errors);
        return;
      }

      registerView.clearFormInput();

      registerView.showLoading();

      await model.createUserData(formData);

      registerView.hideLoading();

      registerView.disableSubmit();

      registerView.showSuccess();

      await delay(3000);

      location.href = "index.html";
    } catch (error) {
      console.error(error);
    } finally {
      //   registerView.hideLoading();
    }
  },
};

registerController.init();
