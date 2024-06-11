const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const currency = document.getElementById('currency');
const errorMessage = document.getElementById('error-message');
const coinsDisplay = document.getElementById('coins-display');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
let userCoins = 0;

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    errorMessage.textContent = 'Please add a text and amount';
    errorMessage.style.visibility = 'visible';
  } else {
    errorMessage.style.visibility = 'hidden';

    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      currency: currency.value // Include currency in the transaction object
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
    text.focus();
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const currencySymbol = getCurrencySymbol(transaction.currency);

  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${currencySymbol}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  const currencySymbol = getCurrencySymbol(currency.value);
  balance.innerText = `${currencySymbol}${total}`;
  money_plus.innerText = `${currencySymbol}${income}`;
  money_minus.innerText = `${currencySymbol}${expense}`;

  // Add fun message or emoji if expense exceeds income
  if (parseFloat(expense) > parseFloat(income)) {
    balance.innerText = 'Oh no! 🙈 You spent more than you earned!';
  }
}

// Helper function to get currency symbol
function getCurrencySymbol(currencyCode) {
  switch(currencyCode) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'KRW':
      return '₩'; // Korean Won
    case 'NPR':
      return '₨'; // Nepalese Rupees
    default:
      return '$'; // Default to Dollar if currency code not found
  }
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize the application
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listener for form submission
form.addEventListener('submit', addTransaction);

// Financial Jokes or Memes
const financialJokes = [
  "Why don't financial analysts ever joke about ground beef? Because it's a little too 'risky!'",
  "Why did the investor bring a ladder to the bar? Because he heard the drinks were on the house!",
  "Why did the banker switch to a 15-minute lunch break? He heard it was the best way to 'compound' his interest!",
  // Add more jokes or memes here
];

function displayRandomJokeOrMeme() {
  const randomIndex = Math.floor(Math.random() * financialJokes.length);
  const jokeOrMeme = financialJokes[randomIndex];
  alert(jokeOrMeme);
}

// Achievements and Rewards
function earnCoins(amount) {
  userCoins += amount;
  updateCoinsDisplay();
}

function updateCoinsDisplay() {
  coinsDisplay.textContent = `Coins: ${userCoins}`;
}

// Initial initialization
init();
