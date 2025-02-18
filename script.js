document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const monthlyAmount = document.getElementById("monthly-amount");
    const categoryFilter = document.getElementById("category-filter");
    const dateFilter = document.getElementById("date-filter");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatAmount(amount) {
        return parseFloat(amount).toFixed(2);
    }

    function getCategoryIcon(category) {
        const icons = {
            'Food': 'fas fa-utensils',
            'Transport': 'fas fa-car',
            'Utilities': 'fas fa-bolt',
            'Entertainment': 'fas fa-film',
            'Shopping': 'fas fa-shopping-bag',
            'Other': 'fas fa-star'
        };
        return icons[category] || 'fas fa-star';
    }

    function filterExpenses(expenses) {
        const selectedCategory = categoryFilter.value;
        const selectedDate = dateFilter.value;
        const currentDate = new Date();

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const categoryMatch = !selectedCategory || expense.category === selectedCategory;
            
            let dateMatch = true;
            if (selectedDate === 'today') {
                dateMatch = expenseDate.toDateString() === currentDate.toDateString();
            } else if (selectedDate === 'week') {
                const weekAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
                dateMatch = expenseDate >= weekAgo;
            } else if (selectedDate === 'month') {
                dateMatch = expenseDate.getMonth() === currentDate.getMonth() &&
                           expenseDate.getFullYear() === currentDate.getFullYear();
            }

            return categoryMatch && dateMatch;
        });
    }

    function updateSummary() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const monthlyTotal = expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth &&
                       expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        totalAmount.textContent = formatAmount(total);
        monthlyAmount.textContent = formatAmount(monthlyTotal);
    }

    function renderExpenses() {
        const filteredExpenses = filterExpenses(expenses);
        expenseList.innerHTML = "";
        
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach((expense, index) => {
                const li = document.createElement("li");
                li.classList.add("list-group-item");
                li.innerHTML = `
                    <div class="expense-details">
                        <span class="expense-title">
                            <i class="${getCategoryIcon(expense.category)} expense-icon"></i>
                            ${expense.name}: R${formatAmount(expense.amount)}
                        </span>
                        <span class="expense-category">${expense.category}</span>
                        <span class="expense-date">${formatDate(expense.date)}</span>
                    </div>
                    <span class="delete-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </span>
                `;
                expenseList.appendChild(li);
            });

        updateSummary();
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("expense-name").value;
        const amount = document.getElementById("expense-amount").value;
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        if (!name || !amount || !category || !date) {
            alert("Please fill in all fields");
            return;
        }

        expenses.push({
            name,
            amount,
            category,
            date
        });

        expenseForm.reset();
        renderExpenses();
    });

    expenseList.addEventListener("click", (e) => {
        if (e.target.closest(".delete-btn")) {
            const index = parseInt(e.target.closest(".delete-btn").dataset.index);
            expenses.splice(index, 1);
            renderExpenses();
        }
    });

    categoryFilter.addEventListener("change", renderExpenses);
    dateFilter.addEventListener("change", renderExpenses);

    // Initial render
    renderExpenses();
});