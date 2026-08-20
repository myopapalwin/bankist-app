import { dashboardController } from "../controllers/dashboardController.js";
import { baseView } from "./baseView.js";

const UI = {
  user: document.querySelector(".user"),
  movements: {
    container: document.querySelector(".movements"),
  },
  balance: {
    value: document.querySelector(".balance__value"),
    date: document.querySelector(".date"),
  },
  summary: {
    in: document.querySelector(".summary__value--in"),
    out: document.querySelector(".summary__value--out"),
    interest: document.querySelector(".summary__value--interest"),
    btnSort: document.querySelector(".btn--sort"),
  },
  transfer: {
    form: document.querySelector(".form--transfer"),
    to: document.querySelector(".form__input--to"),
    amount: document.querySelector(".form__input--amount"),
    btn: document.querySelector(".form__btn--transfer"),
  },
  loan: {
    form: document.querySelector(".form--loan"),
    amount: document.querySelector(".form__input--loan-amount"),
    btn: document.querySelector(".form__btn--loan"),
  },
  close: {
    form: document.querySelector(".form--close"),
    username: document.querySelector(".form__input--username"),
    password: document.querySelector(".form__input--password"),
    btn: document.querySelector(".form__btn--close"),
  },
};

export const dashboardView = {
  ...baseView,

  showUser(account) {
    UI.user.textContent = `Welcome back ${account.owner}`;
  },
  renderMovements(movements) {
    UI.movements.container.innerHTML = "";
    movements.forEach((movement, i) => {
      const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${movement.type}">
                ${i + 1} ${movement.type}
            </div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${movement.amount} USD</div>
        </div>
      `;

      UI.movements.container.insertAdjacentHTML("afterbegin", html);
    });
  },

  renderSummary(summary) {
    UI.balance.value.textContent = `${summary.balance} USD`;
    UI.summary.in.textContent = `${summary.totalDeposit} USD`;
    UI.summary.out.textContent = `${summary.totalWithdrawal} USD`;
    UI.summary.interest.textContent = `${summary.interest} USD`;
  },

  // Transfer Form
  getTransferFormData() {
    return {
      receiverName: UI.transfer.to.value,
      amount: UI.transfer.amount.value,
    };
  },

  bindTransferEvent(handler) {
    UI.transfer.form.addEventListener("submit", (e) => {
      e.preventDefault();

      handler(this.getTransferFormData());
    });
  },

  clearTransferInputs() {
    UI.transfer.to.value = "";
    UI.transfer.amount.value = "";
  },

  // Loan Form
  getLoanFormData() {
    return {
      amount: UI.loan.amount.value,
    };
  },

  bindLoanEvent(handler) {
    UI.loan.form.addEventListener("submit", (e) => {
      e.preventDefault();

      handler(this.getLoanFormData());
    });
  },

  clearLoanInputs() {
    UI.loan.amount.value = "";
  },

  // Close Account
  getCloseAccountFormData() {
    return {
      username: UI.close.username.value,
      password: UI.close.password.value,
    };
  },

  bindCloseAccountEvent(handler) {
    UI.close.form.addEventListener("submit", (e) => {
      e.preventDefault();

      handler(this.getCloseAccountFormData());
    });
  },

  // Sorting
  bindSortingEvent(handler) {
    UI.summary.btnSort.addEventListener("click", function (e) {
      e.preventDefault();
      handler();
    });
  },
};
