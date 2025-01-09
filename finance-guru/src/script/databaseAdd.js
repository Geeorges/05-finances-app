import { Client, Databases, ID } from 'appwrite';
import { createExpenseItem, countFutureExpenses, sumMonthlyExpenses, sumMonthlyNecessaryExpenses, sumRemainder, sumNecessaryRemainder } from './main.js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('677cfbf80024ca31f98e'); // Your project ID

const databases = new Databases(client);

let ctaNewExpense = document.querySelector("#ctaNewExpense");
let appDefaultWindow = document.querySelector("#app__default");
let newExpenseWindow = document.querySelector("#app__new-expense");

ctaNewExpense.addEventListener('click', function (event) {
    event.preventDefault();
    console.log('Button clicked!');
    newExpenseWindow.classList.toggle("active");
});

async function saveNewExpense(newExpenseName, newExpensePrice, newExpenseNecessity) {
    try {
        // Convert the price to a number
        newExpensePrice = parseFloat(newExpensePrice);

        // Check if the price is a valid number
        if (isNaN(newExpensePrice) || newExpensePrice <= 0) {
            console.error("Invalid price:", newExpensePrice);
            alert("Please enter a valid price greater than zero.");
            return; // Exit the function if the price is not valid
        }

        // Generate unique ID for the document
        const documentId = ID.unique();

        // Create a new document in the specified collection
        const promise = databases.createDocument(
            '677cfce2002966595b89', // databaseId
            '677cff29003d21e5d42b', // collectionId
            documentId, // Unique document ID
            {
                Name: newExpenseName,
                Price: newExpensePrice,
                Neccesary: newExpenseNecessity
            }
        );

        promise.then(function (response) {
            console.log('Document created successfully:', response);
            createExpenseItem(newExpenseName, newExpensePrice, newExpenseNecessity);
            countFutureExpenses();
            sumMonthlyExpenses();
            sumMonthlyNecessaryExpenses();
            sumRemainder();
            sumNecessaryRemainder();
            newExpenseWindow.classList.remove("active"); // Close the expense form after saving
        }, function (error) {
            console.error('Error creating document:', error);
            alert("There was an error saving your expense. Please try again.");
        });

    } catch (error) {
        console.error("Error in saveNewExpense function:", error);
        alert("There was an error processing your expense. Please try again.");
    }
}

let newExpenseForm = newExpenseWindow.querySelector("form");

newExpenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let expense = document.getElementById("expenseName");

    // Check if the expense name is empty
    if ((expense.value).trim() === "") {
        expense.focus(); // Focus on the expense name input field
        alert("Expense name is required.");
    } else {
        // Get data from the form inputs
        let formData = new FormData(event.target);
        let data = Object.fromEntries(formData.entries());

        let newExpenseName = data['newExpenseName'].trim();
        let newExpensePrice = data['newExpensePrice'].trim();
        let newExpenseNecessity = document.getElementById('expenseNecessarity').checked; // Get checkbox value (true/false)

        // Save data
        saveNewExpense(newExpenseName, newExpensePrice, newExpenseNecessity);

        // Optionally reset form only after a successful save (not before)
        event.target.reset();
        expense.focus(); // Optionally focus on the expense name after submission
    }
});
