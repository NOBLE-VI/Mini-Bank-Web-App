'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Nikhil Ghorpade',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Swapnil Ghorpade',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

//Setting today's date

const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
};
const local = navigator;
labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);

// Functions

alert(`User id = ng 
password = 1111

----------------------------------------------------------------------------
ENTER THIS USER ID AND PASSWORD FIELD ON TOP RIGHT CORNER
----------------------------------------------------------------------------

`);

//function to display the money movements
const displayMovements = function (acc, sort = false) {
  //clear the dummy html data
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (movement, key, arr) {
    //setting transaction date
    const date = new Date(acc.movementsDates[key]);
    const tyear = `${date.getFullYear()}`;
    const tmonth = `${date.getMonth() + 1}`.padStart(2, 0);
    const tdate = `${date.getDate()}`.padStart(2, 0);
    const displayDate = `${tdate}/${tmonth}/${tyear}`;

    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${key + 1} ${type}t</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${movement.toFixed(2)}₹</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//function to create username from the owner's name
const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => {
        return word[0];
      })
      .join('');
  });
};

createUserNames(accounts);

//function to calculate and display total balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, val, i, arr) => {
    return acc + val;
  }, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)} ₹`;
};

//function to calculate and display summary
const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${income.toFixed(2)} ₹`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} ₹`;

  const intrest = account.movements
    .filter(mov => mov > 0)
    .map(deposits => (deposits * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${intrest.toFixed(2)}₹`;
};

//global variables
let currentAccount, st;

const updateUI = function (account) {
  //Display movements
  displayMovements(account);
  //Display balance
  calcDisplayBalance(account);
  //Display summary
  calcDisplaySummary(account);
};

//EVENT HANDLERS

//login and checks...
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  //checking the pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome msg
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    //clear any previous timer
    if (st) clearInterval(st);
    st = timer();

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    containerApp.style.opacity = 1;

    updateUI(currentAccount);
  }
});

//loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      //addding date
      currentAccount.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentAccount);
    }, 3000);
  } else {
    console.log("loan can't be granted");
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  //reset timer
  clearInterval(st);
  st = timer();
});

// transfer money to other account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    //transfer logic
    currentAccount.movements.push(amount * -1);
    receiverAcc.movements.push(amount);

    //adding dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Re-render the UI
    updateUI(currentAccount);

    console.log('valid transfer');
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  //reset timer
  clearInterval(st);
  st = timer();
});

//Deleting the account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const cUserName = inputCloseUsername.value;
  const cPin = Number(inputClosePin.value);

  if (currentAccount.userName === cUserName && currentAccount.pin === cPin) {
    //remove currentAccount from accounts array

    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);

    currentAccount = undefined;
    containerApp.style.opacity = 0;
    console.log('Accounts: ', accounts);
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

//sorting toggler
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});

//timer

const timer = function () {
  let time = 600;

  const tick = function () {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(st);
      containerApp.style.opacity = 0;
      currentAccount = undefined;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  //to call it immediately
  tick();

  const st = setInterval(tick, 1000);
  return st;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// //Check for NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20x'));
// console.log(Number.isNaN(20 / 0));

// // check for Number
// console.log(Number.isFinite(20.0));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20x'));
// console.log(Number.isFinite(20 / 0));

//Math functions
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(Math.max(2, 45, 34, '87', 1, 12));
// console.log(Math.min(2, 45, 34, '87', 1, 12));

// console.log(Math.trunc(Math.random() * 7));

// const randomInt = function (min, max) {
//   return Math.trunc(Math.random() * max) + min;
// };
// const randomInt2 = function (min, max) {
//   return Math.trunc(Math.random() * (max - min) + 1) + min;
// };

// // console.log(randomInt(1, 5));
// console.log(randomInt2(1, 5));

//rounding the decimal number

// console.log(Math.trunc(23.55));

// console.log(Math.round(23.4));
// console.log(Math.round(23.55));

// console.log(Math.ceil(23.1));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.1));
// console.log(Math.floor(23.9));

//rounding decimals
// console.log((2.5).toFixed(0));
// console.log((2.53219).toFixed(3));
// console.log(+(2.53219).toFixed(3));

//Dates

// const now = new Date();
// console.log(`${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`);
