document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseDateInput = document.getElementById("expense-date"); // New Date Input
    const expenseList = document.getElementById("expense-list");
    const totalAmountDisplay = document.getElementById("total-amount");

    // Fix: Added fallback to empty array if no expenses in local storage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let totalAmount = calculateTotal();

    // Initial rendering of expenses
    renderExpenses();
    updateTotal();

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());
        const date = expenseDateInput.value; // Capture Date

        if (name !== "" && !isNaN(amount) && amount > 0 && date !== "") {
            const newExpense = {
                id: Date.now(),
                name: name,
                amount: amount,
                date: date, // Store Date
            };
            expenses.push(newExpense);
            saveExpensesToLocal();
            renderExpenses();
            updateTotal();

            // Clear input
            expenseNameInput.value = "";
            expenseAmountInput.value = "";
            expenseDateInput.value = "";
        }
    });

    function renderExpenses() {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.name} - ₹${expense.amount.toFixed(2)} on ${expense.date}
                <button data-id="${expense.id}">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }

    function calculateTotal() {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    function saveExpensesToLocal() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function updateTotal() {
        totalAmount = calculateTotal();
        totalAmountDisplay.textContent = `₹${totalAmount.toFixed(2)}`;
    }

    expenseList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const expenseId = parseInt(e.target.getAttribute('data-id'));
            expenses = expenses.filter(expense => expense.id !== expenseId);

            saveExpensesToLocal();
            renderExpenses();
            updateTotal();
        }
    });
});
