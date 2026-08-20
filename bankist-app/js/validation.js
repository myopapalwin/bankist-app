export const validation = {
  // Rule Validators
  validateRequired(value, fl, msg) {
    if (!value?.trim()) {
      return {
        field: fl,
        message: msg,
      };
    }
  },

  validateUsernameFormat(username, fl, msg) {
    const regex = /^[a-zA-Z0-9]+$/;
    if (regex.test(username)) {
      return {
        field: fl,
        message: msg,
      };
    }
  },

  validateMinLength(value, min, fl, msg) {
    if (value.length < min) {
      return {
        field: fl,
        message: msg,
      };
    }
  },

  validateMaxLength(value, max, fl, msg) {
    if (value.length > max) {
      return {
        field: fl,
        message: msg,
      };
    }
  },

  validatePasswordNumber(password, fl, msg) {
    const regex = /^[0-9]+$/; // Matches strings containing only digits
    if (!regex.test(password)) {
      return {
        field: fl,
        message: msg,
      };
    }
  },

  validatePasswordMatch(confirmPass, password, fl, msg) {
    if (confirmPass !== password) {
      return {
        field: fl,
        message: msg,
      };
    }
  },

  // Register helper
  validateOwnername(ownerName) {
    const requiredError = validation.validateRequired(
      ownerName,
      "ownerName",
      "Please Enter Owner Name.",
    );
    if (requiredError) return requiredError;

    const minLengthError = validation.validateMinLength(
      ownerName,
      3,
      "ownerName",
      "Owner name must not less than 3 characters.",
    );
    if (minLengthError) return minLengthError;

    const maxLengthError = validation.validateMaxLength(
      ownerName,
      20,
      "ownerName",
      "Owner name must not exceed than 20 characters.",
    );
    if (maxLengthError) return maxLengthError;
  },

  validateUsername(username) {
    const requiredError = validation.validateRequired(
      username,
      "username",
      "Please Enter User Name.",
    );
    if (requiredError) return requiredError;

    const hasSpace = /\s/.test(username);
    if (hasSpace) {
      return {
        field: "username",
        message: "Spaces are not allowed.",
      };
    }

    const format = validation.validateUsernameFormat(
      username,
      "username",
      "User name must have at least 1 numbers, 1 special number",
    );
    if (format) return format;

    const minLengthError = validation.validateMinLength(
      username,
      3,
      "username",
      "User name must not less than 3 characters.",
    );
    if (minLengthError) return minLengthError;

    const maxLengthError = validation.validateMaxLength(
      username,
      20,
      "username",
      "User name must not exceed than 20 characters.",
    );
    if (maxLengthError) return maxLengthError;
  },

  validatePassword(password) {
    const requiredError = validation.validateRequired(
      password,
      "password",
      "Please enter password",
    );
    if (requiredError) return requiredError;

    const minLengthError = validation.validateMinLength(
      password,
      4,
      "password",
      "Password must be at least 4 digits.",
    );
    if (minLengthError) return minLengthError;

    const maxLengthError = validation.validateMaxLength(
      password,
      4,
      "password",
      "Password do not exceed 4 digits",
    );
    if (maxLengthError) return maxLengthError;

    const numberOnly = validation.validatePasswordNumber(
      password,
      "password",
      "Password must be only number.",
    );
    if (numberOnly) return numberOnly;
  },

  validateConfirmPass(conPass, password) {
    const requiredError = validation.validateRequired(
      conPass,
      "confirmPass",
      "Please enter confirm password",
    );
    if (requiredError) return requiredError;

    const matchPassword = validation.validatePasswordMatch(
      conPass,
      password,
      "confirmPass",
      "Password do not match.",
    );
    if (matchPassword) return matchPassword;
  },

  validateBalance(balance) {
    const requiredError = validation.validateRequired(
      balance,
      "balance",
      "Please enter initial balance.",
    );
    if (requiredError) return requiredError;

    if (balance <= 0) {
      return {
        field: "balance",
        message: "Please input valid balance",
      };
    }
  },

  // Loan
  validateLoan(data) {
    const { loanUser, loanAmount, deposit } = data;

    const errors = [];

    if (!Number.isFinite(loanAmount) && loanAmount <= 0) {
      errors.push({
        field: "loan",
        message: "Please input valid amount",
      });
    }

    if (deposit < loanAmount) {
      errors.push({
        field: "loan",
        message: "Loan amount must not exceed your deposite.",
      });
    }

    if (!loanUser) {
      errors.push({
        field: "loan",
        message: "User does not exists.",
      });
    }

    return errors;
  },

  // Transfer
  validateTransfer(data) {
    const { receiverName, amount, balance } = data;
    const errors = [];

    if (amount >= balance) {
      errors.push({
        field: "transfer",
        message: "Your transfer amount must not exceed your balance.",
      });
    }

    if (!Number.isFinite(amount) && !receiverName.trim()) {
      errors.push({
        field: "transfer",
        message: "Please enter receiver account and amount.",
      });
    }

    if (!Number.isFinite(amount) && amount < 0) {
      errors.push({
        field: "transfer",
        message: "Please input valid amount",
      });
    }

    return errors;
  },

  // Register Form
  handleRegister(formData) {
    const errors = [
      validation.validateOwnername(formData.ownerName),
      validation.validateUsername(formData.username),
      validation.validatePassword(formData.password),
      validation.validateConfirmPass(formData.confirmPass, formData.password),
      validation.validateBalance(formData.balance),
    ].filter(Boolean);

    return errors;
  },

  // Login Form
  validateLogin(formData) {
    const { username, password } = formData;
    const requiredUser = this.validateRequired(
      username,
      "username",
      "Please enter user name.",
    );

    const requiredPass = this.validateRequired(
      password,
      "password",
      "Please enter password.",
    );

    const errors = [requiredUser, requiredPass].filter(Boolean);

    return errors;
  },

  // Delete Account
  isCurrentUser(user, pin, currentAccount) {
    if (
      !user?.trim() ||
      !pin ||
      currentAccount.userName !== user ||
      pin !== currentAccount.pin
    ) {
      return {
        field: "close",
        message: "You cannot delete. Try again later.",
      };
    }
  },
};
