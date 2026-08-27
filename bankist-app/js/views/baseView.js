const UI = {
  loading: { container: document.querySelector(".overlay") },
  success: { container: document.querySelector(".success") },
};
export const baseView = {
  showLoading() {
    UI.loading.container.classList.remove("hidden");
  },

  hideLoading() {
    UI.loading.container.classList.add("hidden");
  },

  showSuccess() {
    UI.success.container.classList.remove("hidden");
  },

  renderErrors(errors) {
    errors.forEach((error) => {
      document.querySelector(`[data-error="${error.field}"]`).textContent =
        error.message;
    });
  },

  clearErrors() {
    document.querySelectorAll("[data-error]").forEach((el) => {
      el.textContent = "";
    });
  },
};
