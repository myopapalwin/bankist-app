import { accountModel, state } from "../models/accountModel.js";
import { validation } from "../validation.js";
import { loginView } from "../views/loginView.js";
import { auth } from "../helper.js";

export const loginController = {
  async init() {
    try {
      const users = await accountModel.loadUsers();
      console.log(users);

      loginView.bindLogin(this.login);
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

      loginView.clearErrors();

      if (errors.length) {
        loginView.renderErrors(errors);
        return; // !important
      }

      const account = accountModel.findAccountByUsername(formData.username);

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
