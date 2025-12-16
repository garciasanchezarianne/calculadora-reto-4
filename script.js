

const screen = document.getElementById('screen');
const numbers = document.querySelectorAll('.btn.number');
const operators = document.querySelectorAll('.btn.operator');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');


let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let waitingForSecond = false;

/* actualizar la pantalla */
function updateScreen(value) {
  screen.textContent = value;
}

/* manejo a los botones numéricos */
numbers.forEach(btn => {
  btn.addEventListener('click', () => {
    const digit = btn.getAttribute('data-num');

    
    if (waitingForSecond) {
      
      updateScreen(digit === '.' ? '0.' : digit);
      waitingForSecond = false;
      return;
    }

    // Si la pantalla muestra "0" y el usuario ingresa un dígito que no es ".", reemplazamos
    if (screen.textContent === '0' && digit !== '.') {
      updateScreen(digit);
      return;
    }

    // Evita múltiples puntos decimales
    if (digit === '.' && screen.textContent.includes('.')) {
      return;
    }

    // Concatena dígitos normales
    updateScreen(screen.textContent === '0' ? (digit === '.' ? '0.' : digit) : screen.textContent + digit);
  });
});

/* Manejo de operadores */
operators.forEach(opBtn => {
  opBtn.addEventListener('click', () => {
    const op = opBtn.getAttribute('data-op');

    // Si no hay primer operando guardado, guardamos el contenido actual de la pantalla
    if (firstOperand === null) {
      firstOperand = parseFloat(screen.textContent);
    } else if (!waitingForSecond) {
      // Si ya hay uno y no estamos esperando, podemos encadenar operaciones 
      secondOperand = parseFloat(screen.textContent);
      firstOperand = computeResult(firstOperand, secondOperand, currentOperator);
      updateScreen(String(firstOperand));
    }

    currentOperator = op;
    waitingForSecond = true;
  });
});

/* Botón igual */
equalsBtn.addEventListener('click', () => {
  if (currentOperator === null) {
    return; // nada que calcular
  }

  secondOperand = parseFloat(screen.textContent);
  const result = computeResult(firstOperand, secondOperand, currentOperator);

  // Mostrar resultado y reiniciar estado para nuevas operaciones
  updateScreen(String(result));
  firstOperand = result;
  secondOperand = null;
  currentOperator = null;
  waitingForSecond = false;
});

/* Botón limpiar */
clearBtn.addEventListener('click', () => {
  firstOperand = null;
  secondOperand = null;
  currentOperator = null;
  waitingForSecond = false;
  updateScreen('0');
});

/* Función central de cálculo (control de errores: división por cero) */
function computeResult(a, b, operator) {
  if (typeof a !== 'number' || typeof b !== 'number') return 0;

  let res = 0;
  switch (operator) {
    case '+':
      res = a + b;
      break;
    case '-':
      res = a - b;
      break;
    case '*':
      res = a * b;
      break;
    case '/':
      if (b === 0) {
        alert('Error: división entre cero no permitida.');
        return a; // mantenemos el valor previo
      }
      res = a / b;
      break;
    default:
      res = b;
  }

  // Limitar a 12 dígitos significativos para evitar notación expo
  if (!Number.isInteger(res)) {
    res = parseFloat(res.toFixed(10));
  }

  return res;
}


document.addEventListener('keydown', (e) => {
  const key = e.key;

  if ((/^[0-9.]$/).test(key)) {
    // simula click en el botón correspondiente
    const btn = [...numbers].find(n => n.getAttribute('data-num') === key);
    if (btn) btn.click();
  } else if (['+', '-', '*', '/'].includes(key)) {
    const opBtn = [...operators].find(o => o.getAttribute('data-op') === key);
    if (opBtn) opBtn.click();
  } else if (key === 'Enter' || key === '=') {
    equalsBtn.click();
  } else if (key === 'Escape') {
    clearBtn.click();
  }
});
