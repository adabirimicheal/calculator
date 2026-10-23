const screen = document.querySelector("#input1");
const zero = document.querySelector("#zero");
const one = document.querySelector("#one");
const two = document.querySelector("#two");
const three = document.querySelector("#three");
const four = document.querySelector("#four");
const five = document.querySelector("#five");
const six = document.querySelector("#six");
const seven = document.querySelector("#seven");
const eight = document.querySelector("#eight");
const nine = document.querySelector("#nine");
const decimal = document.querySelector("#decimal");
const percentage = document.querySelector("#percentage");
const add = document.querySelector("#add");
const subtract = document.querySelector("#subtract");
const multiply = document.querySelector("#multiply");
const divide = document.querySelector("#divide");
const clearButton = document.querySelector("#clear");
const cancelButton = document.querySelector("#cancel");
const equalButton = document.querySelector("#eq");

let currentValue = "0";
let storedValue = null;
let selectedOperator = null;
let startNewValue = false;

function updateScreen() {
  screen.value = selectedOperator
    ? `${storedValue} ${selectedOperator}${startNewValue ? "" : ` ${currentValue}`}`
    : currentValue;
}

function enterDigit(digit) {
  if (startNewValue || currentValue === "Error") {
    currentValue = digit;
    startNewValue = false;
  } else if (currentValue === "0") {
    currentValue = digit;
  } else {
    currentValue += digit;
  }
  updateScreen();
}

function enterDecimal() {
  if (startNewValue || currentValue === "Error") {
    currentValue = "0.";
    startNewValue = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateScreen();
}

function calculate(left, right, operator) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*": 
      return left * right;
    case "/":
      return right === 0 ? null : left / right;
    default:
      return null;
  }
}

function chooseOperator(operator) {
  if (currentValue === "Error") return;

  if (selectedOperator && !startNewValue) {
    const result = calculate(
      Number(storedValue),
      Number(currentValue),
      selectedOperator
    );
    if (result === null || !Number.isFinite(result)) {
      currentValue = "Error";
      storedValue = null;
      selectedOperator = null;
      updateScreen();
      return;
    }
    currentValue = String(Number(result.toPrecision(12)));
  }

  storedValue = currentValue;
  selectedOperator = operator;
  startNewValue = true;
  updateScreen();
}

zero.addEventListener("click", () => enterDigit("0"));
one.addEventListener("click", () => enterDigit("1"));
two.addEventListener("click", () => enterDigit("2"));
three.addEventListener("click", () => enterDigit("3"));
four.addEventListener("click", () => enterDigit("4"));
five.addEventListener("click", () => enterDigit("5"));
six.addEventListener("click", () => enterDigit("6"));
seven.addEventListener("click", () => enterDigit("7"));
eight.addEventListener("click", () => enterDigit("8"));
nine.addEventListener("click", () => enterDigit("9"));
decimal.addEventListener("click", enterDecimal);

add.addEventListener("click", () => chooseOperator("+"));
subtract.addEventListener("click", () => chooseOperator("-"));
multiply.addEventListener("click", () => chooseOperator("*"));
divide.addEventListener("click", () => chooseOperator("/"));

equalButton.addEventListener("click", () => {
  if (!selectedOperator || startNewValue || currentValue === "Error") return;

  const result = calculate(
    Number(storedValue),
    Number(currentValue),
    selectedOperator
  );
  currentValue = result === null || !Number.isFinite(result)
    ? "Error"
    : String(Number(result.toPrecision(12)));
  storedValue = null;
  selectedOperator = null;
  startNewValue = true;
  updateScreen();
});

clearButton.addEventListener("click", () => {
  currentValue = "0";
  storedValue = null;
  selectedOperator = null;
  startNewValue = false;
  updateScreen();
});

cancelButton.addEventListener("click", () => {
  if (startNewValue && selectedOperator) return;

  if (currentValue === "Error") {
    currentValue = "0";
  } else {
    currentValue = currentValue.slice(0, -1);
    if (currentValue === "" || currentValue === "-") {
      currentValue = "0";
    }
  }
  startNewValue = false;
  updateScreen();
});

percentage.addEventListener("click", () => {
  if (currentValue === "Error" || (selectedOperator && startNewValue)) return;

  const result = Number(currentValue) / 100;
  currentValue = Number.isFinite(result)
    ? String(Number(result.toPrecision(12)))
    : "Error";
  updateScreen();
});

updateScreen();

/* ---------- Loading screen ---------- */
const loader = document.querySelector("#loader");
const loaderFill = document.querySelector("#loader-fill");
const loaderStatus = document.querySelector("#loader-status");

let loadPercent = 0;

// Every 40 milliseconds, add a small random amount to the progress.
const loadTimer = setInterval(() => {
  loadPercent += Math.random() * 2.2;

  if (loadPercent >= 100) {
    loadPercent = 100;
    clearInterval(loadTimer);
    finishLoading();
  }

  loaderFill.style.width = `${loadPercent}%`;
  loaderStatus.textContent = `LOADING ${Math.floor(loadPercent)}%`;
}, 40);

function finishLoading() {
  loaderStatus.textContent = "READY";

  // Wait a moment, then fade the loading screen out and show the calculator.
  setTimeout(() => {
    loader.classList.add("loader-hidden");
    document.body.classList.remove("is-loading");
  }, 500);
}
