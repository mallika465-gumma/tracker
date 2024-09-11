document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');

    // Load expenses from local storage
    const loadExpenses = () => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            createExpenseItem(expense.name, expense.amount, expense.id);
        });
    };

    // Save expenses to local storage
    const saveExpenses = (expenses) => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    };

    // Create an expense list item
    const createExpenseItem = (name, amount, id) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${name} - $${amount}
            <button class="edit" onclick="editExpense(${id})">Edit</button>
            <button class="delete" onclick="deleteExpense(${id})">Delete</button>
        `;
        expenseList.appendChild(li);
    };

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = expenseNameInput.value;
        const amount = parseFloat(expenseAmountInput.value);
        if (name && !isNaN(amount)) {
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            const id = expenses.length ? expenses[expenses.length - 1].id + 1 : 1;
            expenses.push({ name, amount, id });
            saveExpenses(expenses);
            createExpenseItem(name, amount, id);
            expenseNameInput.value = '';
            expenseAmountInput.value = '';
        }
    });

    // Edit expense
    window.editExpense = (id) => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const expense = expenses.find(exp => exp.id === id);
        if (expense) {
            expenseNameInput.value = expense.name;
            expenseAmountInput.value = expense.amount;
            form.removeEventListener('submit', addExpense);
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                expense.name = expenseNameInput.value;
                expense.amount = parseFloat(expenseAmountInput.value);
                saveExpenses(expenses);
                expenseList.innerHTML = '';
                expenses.forEach(exp => createExpenseItem(exp.name, exp.amount, exp.id));
                expenseNameInput.value = '';
                expenseAmountInput.value = '';
                form.removeEventListener('submit', editExpense);
                form.addEventListener('submit', addExpense);
            });
        }
    };

    // Delete expense
    window.deleteExpense = (id) => {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.filter(exp => exp.id !== id);
        saveExpenses(expenses);
        expenseList.innerHTML = '';
        expenses.forEach(exp => createExpenseItem(exp.name, exp.amount, exp.id));
    };

    loadExpenses();
});