import { model, state } from "../model.js";
import { validation } from "../validation.js";
import { loginView } from "../views/loginView.js";
import { auth } from "../helper.js";

export const loginController = {
  async init() {
    try {
      const users = await model.loadUsers();
      console.log(users);

      loginView.bindLogin(loginController.login);
    } catch (error) {
      console.error(error);
    } finally {
    }
  },
  login(formData) {
    try {
      state.sortState = false;

      const errors = validation.validateLogin(formData);
      console.log(errors);

      loginView.clearErrors(errors);

      if (errors.length) {
        loginView.renderErrors(errors);
        return; // !important
      }

      const account = model.findAccountByUsername(formData.username);

      if (!account) {
        loginView.renderErrors([
          { field: "username", message: "User not found." },
        ]);
        return;
      }

      if (account.pin !== Number(formData.password)) {
        loginView.renderErrors([
          { field: "password", message: "Wrong Password!" },
        ]);
        return;
      }

      state.currentAccount = account;

      // Store in memory
      auth.saveUser(account);

      window.location.href = "/dashboard.html";

      loginView.clearFormInput();
    } catch (error) {
      console.error(error);
    }
  },
};

loginController.init();
