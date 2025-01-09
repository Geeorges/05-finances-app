import { Client, Databases } from 'appwrite';
import { parseCurrency, formatCZK, createExpenseItem, countFutureExpenses, sumMonthlyExpenses, sumMonthlyNecessaryExpenses, sumRemainder, sumNecessaryRemainder } from './main.js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('677cfbf80024ca31f98e'); // Your project ID

const databases = new Databases(client);

// Fetch income
async function fetchIncome() {
    try {
        const results = await databases.listDocuments(
            '677cfce2002966595b89', // databaseId
            '677cfcf900311d4949eb' // collectionId
        );

        results.documents.forEach(result => {
            let incomeValue = result.Income;
            let incomeMonth = result.Month;
            showIncome(incomeValue, incomeMonth);
        });
    } catch (error) {
        console.error('Error fetching income:', error);
        alert("Failed to load income data. Please try again.");
    }
}

// Fetch expenses
async function fetchExpenses() {
    try {
        const results = await databases.listDocuments(
            '677cfce2002966595b89', // databaseId
            '677cff29003d21e5d42b' // collectionId
        );

        results.documents.forEach(result => {
            let expenseName = result.Name;
            let expensePrice = result.Price;
            let expenseNeccesary = result.Neccesary;
            createExpenseItem(expenseName, expensePrice, expenseNeccesary);
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        alert("Failed to load expenses data. Please try again.");
    }
}

// Initialize app: Fetch income and expenses
async function initializeApp() {
    try {
        console.log("Fetching income...");
        await fetchIncome();
        console.log("Income fetched. Now fetching expenses...");
        await fetchExpenses();
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

// Call to initialize the app
initializeApp();

// Display income
function showIncome(incomeValue, incomeMonth) {
    let incomeActual = document.querySelector(".overview__list--income span");
    if (incomeActual) {
        incomeActual.innerHTML = incomeValue;
    }
}

// Wait for data to fetch and then execute counting functions
let isProcessing = false;

const observer = new MutationObserver(() => {
    if (isProcessing) return;

    isProcessing = true;

    // Run counting functions
    countFutureExpenses();
    sumMonthlyExpenses();
    sumMonthlyNecessaryExpenses();
    sumRemainder();
    sumNecessaryRemainder();

    // Format currency values
    let currencyElements = document.querySelectorAll(".currency__value");
    currencyElements.forEach(element => {
        if (!element.textContent.includes('Kč')) {
            element.textContent = formatCZK(parseCurrency(element.textContent));
        }
    });

    setTimeout(() => {
        isProcessing = false;
    }, 200);
});

// Watch for changes in the `.expenses__list` element
const targetNode = document.querySelector('.expenses__list');
if (targetNode) {
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });
} else {
    console.error("Expenses list not found in the DOM.");
}
