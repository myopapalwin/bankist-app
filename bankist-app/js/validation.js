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
  validateFirstName(name) {
    const requiredError = validation.validateRequired(
      name,
      "firstName",
      "Please Enter Your First Name.",
    );
    if (requiredError) return requiredError;

    const minLengthError = validation.validateMinLength(
      name,
      3,
      "firstName",
      "First name must not less than 3 characters.",
    );
    if (minLengthError) return minLengthError;

    const maxLengthError = validation.validateMaxLength(
      name,
      15,
      "firstName",
      "First name must not exceed than 20 characters.",
    );
    if (maxLengthError) return maxLengthError;
  },

  validateLastName(name) {
    const requiredError = validation.validateRequired(
      name,
      "lastName",
      "Please Enter Your Last Name.",
    );
    if (requiredError) return requiredError;

    const minLengthError = validation.validateMinLength(
      name,
      3,
      "lastName",
      "Last name must not less than 3 characters.",
    );
    if (minLengthError) return minLengthError;

    const maxLengthError = validation.validateMaxLength(
      name,
      15,
      "lastName",
      "Last name must not exceed than 20 characters.",
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
  validateLoanMoney(deposit, loanAmt, acc) {
    if (!Number.isFinite(loanAmt) || loanAmt <= 0) {
      return {
        field: "amount",
        message: "Please input valid amount",
      };
    }

    if (deposit < loanAmt) {
      return {
        field: "loan",
        message: "Loan amount must not exceed your deposite.",
      };
    }
  },

  // Transfer
  validateTransfer(amount, sender, username, FindReceiverAccFn, balance) {
    if (!Number.isFinite(amount) || !username.trim()) {
      return {
        error: {
          field: "required",
          message: "Please enter receiver account and amount.",
        },
        receiver: null,
      };
    }

    const receiver = FindReceiverAccFn(username);

    if (!receiver) {
      return {
        error: {
          field: "receiver",
          message: "Receiver account does not exist.",
        },
        receiver: null,
      };
    }

    if (receiver === sender) {
      return {
        error: {
          field: "sender",
          message: "You can not transfer same account.",
        },
        receiver: null,
      };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        error: {
          field: "amount",
          message: "Please input valid amount",
        },
        receiver: null,
      };
    }

    if (amount >= balance) {
      return {
        error: {
          field: "amount",
          message: "Your transfer amount must not exceed your balance.",
        },
        receiver: null,
      };
    }

    return {
      receiver,
    };
  },

  // Register Form
  handleRegister(formData) {
    const errors = [
      validation.validateFirstName(formData.firstName),
      validation.validateLastName(formData.lastName),
      validation.validatePassword(formData.password),
      validation.validateConfirmPass(formData.confirmPass, formData.password),
      validation.validateBalance(formData.balance),
    ].filter(Boolean);

    return errors;
  },

  // Login Form
  handleLogin(formData, findAccountFn) {
    const { username, password } = formData;

    if (!username.trim() || !password.trim()) {
      return {
        error: {
          field: "login",
          message: "Enter user name and password.",
        },

        account: null,
      };
    }

    const account = findAccountFn(username);

    if (!account) {
      return {
        error: {
          field: "username",
          message: "User not found.",
        },
        account: null,
      };
    }

    if (Number(password) !== account.pin) {
      return {
        error: {
          field: "password",
          message: "Wrong password",
        },
        account: null,
      };
    }

    return {
      account,
    };
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
