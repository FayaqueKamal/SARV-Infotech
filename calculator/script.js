let display = document.getElementById("display");
let history = document.getElementById("history");

function appendNumber(number) {
  if (number === '.' && display.value.includes('.')) {
    let parts = display.value.split(/[\+\-\*\/]/);
    if (parts[parts.length - 1].includes('.')) return;
  }
  display.value += number;
}

function appendOperator(operator) {
  if (display.value === "") return;

  let lastChar = display.value.slice(-1);

  if (["+", "-", "*", "/"].includes(lastChar)) {
    display.value = display.value.slice(0, -1) + operator;
  } else {
    display.value += operator;
  }
}

// Function to delete the last typed single character/digit
function deleteSingleDigit() {
  display.value = display.value.slice(0, -1);
}

// Clears full screen and history
function clearDisplay() {
  display.value = "";
  history.innerText = "";
}

function calculateResult() {
  let expression = display.value;

  if (!expression) return;

  try {
    let result = parseAndCalculate(expression);
    history.innerText = `${expression} =`;
    display.value = result;
  } catch (error) {
    display.value = "Error";
  }
}

function parseAndCalculate(expr) {
  let tokens = [];
  let currentNumber = "";

  for (let i = 0; i < expr.length; i++) {
    let char = expr[i];

    if ("0123456789.".includes(char)) {
      currentNumber += char;
    } else if (["+", "-", "*", "/"].includes(char)) {
      if (currentNumber !== "") {
        tokens.push(parseFloat(currentNumber));
        currentNumber = "";
      }
      tokens.push(char);
    }
  }
  if (currentNumber !== "") {
    tokens.push(parseFloat(currentNumber));
  }

  // Multiply & Divide pass
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      let prevNum = tokens[i - 1];
      let nextNum = tokens[i + 1];
      let res = 0;

      if (tokens[i] === "*") {
        res = prevNum * nextNum;
      } else if (tokens[i] === "/") {
        if (nextNum === 0) return "Error";
        res = prevNum / nextNum;
      }

      tokens.splice(i - 1, 3, res);
      i--;
    } else {
      i++;
    }
  }

  // Add & Subtract pass
  let total = tokens[0];
  for (let j = 1; j < tokens.length; j += 2) {
    let operator = tokens[j];
    let nextNumber = tokens[j + 1];

    if (operator === "+") {
      total += nextNumber;
    } else if (operator === "-") {
      total -= nextNumber;
    }
  }

  return total;
}

// Keyboard Backspace key support
document.addEventListener("keydown", function(event) {
  let key = event.key;

  if (!isNaN(key) || key === ".") {
    appendNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    appendOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculateResult();
  } else if (key === "Escape") {
    clearDisplay();
  } else if (key === "Backspace") {
    deleteSingleDigit(); // Trigger single digit delete on backspace
  }
});