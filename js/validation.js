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

  validateOwnerName(name) {
    const requiredError = validation.validateRequired(
      name,
      "ownername",
      "Please enter owner name",
    );
    if (requiredError) return requiredError;

    const minLengthError = validation.validateMinLength(
      name,
      3,
      "ownername",
      "Owner name must not less than 3 characters.",
    );
    if (minLengthError) return minLengthError;

    const maxLengthError = validation.validateMaxLength(
      name,
      15,
      "ownername",
      "Owner name must not exceed than 20 characters.",
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

  handleRegister(formData) {
    const errors = [
      validation.validateOwnerName(formData.ownername),
      validation.validatePassword(formData.password),
      validation.validateConfirmPass(formData.confirmPass, formData.password),
    ].filter(Boolean);

    return errors;
  },
};
