// Helper function to format currency
export function formatCZK(value) {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'decimal',
    }).format(value) + ' Kč';
}

// Helper function to strip the currency format and parse the number
export function parseCurrency(value) {
    return parseFloat(value.replace(' Kč', '').replace(/\s/g, '').replace(',', '.'));
}

// Create new expense item
export function createExpenseItem(getName, getPrice, getNeccesary) {
    // Helper function to create elements with attributes and content
    function createElement(tag, classes = [], content = "") {
        let element = document.createElement(tag);
        classes.forEach(cls => element.classList.add(cls));
        if (content) element.textContent = content; // Add text content
        return element;
    }

    // Create elements using the helper function
    let expenseName = createElement("span", ["expenses--name"], getName);
    let expensePrice = createElement("span", ["expenses--monthly", "currency__value"], getPrice);
    let expensePriceYear = createElement("span", ["expenses--yearly", "currency__value"]);
    let expensePriceThreeYear = createElement("span", ["expenses--threeyears", "currency__value"]);
    let expensePriceFiveYear = createElement("span", ["expenses--fiveyears", "currency__value"]);
    let expenseNecessary = createElement("span", ["expenses--neccesary"], getNeccesary || "false");

    let newInputWrapper = createElement("li", ["expenses__item"]);
    // Append everything together
    newInputWrapper.append(expenseName, expensePrice, expensePriceYear, expensePriceThreeYear, expensePriceFiveYear, expenseNecessary);

    // Append the new item to the list
    let expensesList = document.querySelector(".expenses__list");
    if (expensesList) {
        expensesList.append(newInputWrapper);
        // Now that the item is added, query all the items again
    } else {
        console.error("Expenses list element not found.");
    }
}

// Function to count expense items
export function countFutureExpenses() {
    let expenseItems = document.querySelectorAll(".expenses__item");
    
    expenseItems.forEach(item => {
        let monthly = item.querySelector(".expenses--monthly");
        let expenseYear = item.querySelector(".expenses--yearly");
        let expenseThreeYear = item.querySelector(".expenses--threeyears");
        let expenseFiveYear = item.querySelector(".expenses--fiveyears");

        let monthlyValue = parseCurrency(monthly.textContent); // Ensure valid number
        if (isNaN(monthlyValue)) return; // Skip if invalid value

        let year = monthlyValue * 12;
        let threeYear = monthlyValue * 36;
        let fiveYear = monthlyValue * 60;

        expenseYear.textContent = year.toFixed(2); // Display with two decimals
        expenseThreeYear.textContent = threeYear.toFixed(2);
        expenseFiveYear.textContent = fiveYear.toFixed(2);
    });
}

// Function to sum monthly expenses
export function sumMonthlyExpenses() {
    let expenseItems = document.querySelectorAll(".expenses--monthly");
    let total = 0;

    // Loop through each expense item and add its value to the total
    expenseItems.forEach(item => {
        let expenseValue = parseCurrency(item.textContent); // Convert text content to a number
        if (!isNaN(expenseValue)) {
            total += expenseValue; // Add to total if it's a valid number
        }
    });

    // Log the total sum of all monthly expenses
    console.log("Total Monthly Expenses: ", total);
    let expenses = document.querySelector(".overview__list--expenses span");
    
    if (expenses) expenses.textContent = total // Display with two decimals

    return total;
}

// Function to sum necessary expenses
export function sumMonthlyNecessaryExpenses() {
    let expenseItem = document.querySelectorAll(".expenses__item");

    let total = 0;
    
    expenseItem.forEach(item => {
        let expenseItems = item.querySelector(".expenses--monthly");
        let necessary = item.querySelector(".expenses--neccesary");
        if (necessary && necessary.textContent === "true") {
            let expenseValue = parseCurrency(expenseItems.textContent); // Convert text content to a number
            if (!isNaN(expenseValue)) {
                total += expenseValue; // Add to total if it's a valid number
            }
        }
    });

    let expenses = document.querySelector(".overview__list--necessary span");
    
    expenses.textContent = total;
    return total;
}

// Function to calculate remainder (income - expenses)
export function sumRemainder(){
    let income = document.querySelector(".overview__list--income span");
    let expenses = document.querySelector(".overview__list--expenses span");
    let remainder = document.querySelector(".overview__list--remainder span");

    let incomeValue = income ? parseCurrency(income.textContent) : 0; // Default to 0 if not found
    let expensesValue = expenses ? parseCurrency(expenses.textContent) : 0; // Default to 0 if not found

    remainder.textContent = (incomeValue - expensesValue).toFixed(2); // Display with two decimals
}

// income minus necessary expenses
export function sumNecessaryRemainder(){
    let income = document.querySelector(".overview__list--income span");
    let expenses = document.querySelector(".overview__list--necessary span");
    let remainder = document.querySelector(".overview__list--necessary-remainder span");

    let incomeValue = income ? parseCurrency(income.textContent) : 0; // Default to 0 if not found
    let expensesValue = expenses ? parseCurrency(expenses.textContent) : 0; // Default to 0 if not found

    remainder.textContent = (incomeValue - expensesValue).toFixed(2); // Display with two decimals
}