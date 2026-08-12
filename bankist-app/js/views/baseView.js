const UI = {
  loading: { container: document.querySelector(".overlay") },
};
export const baseView = {
  showLoading() {
    UI.loading.container.classList.remove("hidden");
  },

  hideLoading() {
    UI.loading.container.classList.add("hidden");
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
      console.log(el.textContent);
    });
  },
};
