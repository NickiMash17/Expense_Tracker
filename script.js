document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  const totalAmount = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  function renderExpenses() {
      expenseList.innerHTML = "";
      let total = 0;
      expenses.forEach((expense, index) => {
          total += parseFloat(expense.amount);
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.innerHTML = `<span><i class="fas fa-money-bill-wave expense-icon"></i>${expense.name}: R${expense.amount}</span> <span class="delete-btn" data-index="${index}">❌</span>`;
          expenseList.appendChild(li);
      });
      totalAmount.textContent = total.toFixed(2);
      localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("expense-name").value;
      const amount = document.getElementById("expense-amount").value;

      if (name && amount) {
          expenses.push({ name, amount });
          renderExpenses();
          expenseForm.reset();
      }
  });

  expenseList.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
          const index = e.target.getAttribute("data-index");
          expenses.splice(index, 1);
          renderExpenses();
      }
  });

  renderExpenses();
});
