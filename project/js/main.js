const ROWS = document.querySelectorAll(`.buttons__row`);
const INPUT = document.getElementById(`input`);
const EQUALS = document.getElementById(`equals`);

INPUT.value = ``;

let buffer = [];
let bufferNumber = ``;
let isLastNumber = true;
let isNumberDotted = false;

function clear() {
   INPUT.value = ``;
   bufferNumber = ``;
   isLastNumber = true;
   isNumberDotted = false;
}

function actPressed(action, valueLength, inputValue) {
   if (bufferNumber == `` && valueLength == 0) {
      INPUT.value += `0`;
      INPUT.value += action;
      buffer.push(0);
      buffer.push(action);
   }
   else if (isLastNumber) {
      INPUT.value += action;
      buffer.push(+bufferNumber);
      buffer.push(action);
      bufferNumber = ``;
   }
   else {
      INPUT.value = inputValue.slice(0, inputValue.length - 1);
      buffer[valueLength - 1] = action;
      INPUT.value += action;
   }
   isLastNumber = false;
   isNumberDotted = false;

   INPUT.scrollLeft = INPUT.scrollWidth;
}

function numPressed(numPressed) {
   INPUT.value += numPressed;
   bufferNumber += numPressed;
   isLastNumber = true;

   INPUT.scrollLeft = INPUT.scrollWidth;
}

function percentPressed(valueLength) {
   if (isLastNumber && valueLength == 0) {
      bufferNumber /= 100;
      INPUT.value = bufferNumber;
   }
   else if (isLastNumber) {
      let percentAction = buffer.pop();
      let value = buffer.pop();
      let percent = value * bufferNumber / 100;
      INPUT.value = buffer.join(``);

      switch (percentAction) {
         case `-`:
            bufferNumber = value - percent;
            break;
         case `+`:
            bufferNumber = value + percent;
            break;
         case `×`:
            bufferNumber = value * percent;
            break;
         case `/`:
            bufferNumber = value / percent;
            break;
         case `^`:
            bufferNumber = value ** percent;
            break;
      }
      INPUT.value += bufferNumber;
   }
   bufferNumber % 1 != 0 ? isNumberDotted = true : isNumberDotted = false;
}

function dotPressed() {
   if (!isNumberDotted) {
      if (bufferNumber == ``) {
         INPUT.value += `0.`;
         bufferNumber += `0.`;
      }
      else if (isLastNumber) {
         INPUT.value += `.`;
         bufferNumber += `.`;
      }
      isNumberDotted = true;
      isLastNumber = true;

      INPUT.scrollLeft = INPUT.scrollWidth;
   }
}

function deletePressed(valueLength) {
   if (valueLength != 0) {
      if (isLastNumber) {
         bufferNumber = ``;
         isLastNumber = false;
         isNumberDotted = false;
         INPUT.value = buffer.join(``);
      }
      else if (!isLastNumber) {
         buffer.pop();
         INPUT.value = buffer.join(``);
         bufferNumber = buffer[buffer.length - 1] + ``;
         buffer.pop();
         isLastNumber = true;
         bufferNumber % 1 != 0 ? isNumberDotted = true : isNumberDotted = false;
      }
   }
   else {
      bufferNumber = ``;
      INPUT.value = ``;
   }
}

function deleteAllPressed() {
   buffer = [];
   clear();
}

function equals() {
   if (isLastNumber) {
      buffer.push(+bufferNumber);
      bufferNumber = ``;
   }
   else {
      buffer.pop();
   }
   clear();
   while (buffer.length != 1) {
      for (let i = 1; i < buffer.length; i += 2) {
         if (buffer[i] == `-`) {
            buffer[i] = `+`;
            buffer[i + 1] = -buffer[i + 1];
         }
      }
      for (let i = 1; i < buffer.length; i += 2) {
         if (buffer[i] == `^`) {
            let firstValue = buffer[i - 1];
            let secondValue = buffer[i + 1];
            buffer.splice(i - 1, 3, firstValue ** secondValue);
         }
      }
      for (let i = 1; i < buffer.length; i += 2) {
         if (buffer[i] == `×`) {
            let firstValue = buffer[i - 1];
            let secondValue = buffer[i + 1];
            buffer.splice(i - 1, 3, firstValue * secondValue);
         }
      }
      for (let i = 1; i < buffer.length; i += 2) {
         if (buffer[i] == `/`) {
            let firstValue = buffer[i - 1];
            let secondValue = buffer[i + 1];
            buffer.splice(i - 1, 3, firstValue / secondValue);
         }
      }
      for (let i = 1; i < buffer.length; i += 2) {
         if (buffer[i] == `+`) {
            let firstValue = buffer[i - 1];
            let secondValue = buffer[i + 1];
            buffer.splice(i - 1, 3, firstValue + secondValue);
         }
      }
   }
   bufferNumber = buffer.pop();
   INPUT.value = bufferNumber;
}

EQUALS.onclick = equals;

for (let col of ROWS) {
   for (let el of col.children) {
      el.onclick = function () {
         let elementId = el.id;
         let inputValue = INPUT.value;
         let valueLength = buffer.length;
         switch (elementId) {
            case `one`:
               numPressed(`1`);
               break;
            case `two`:
               numPressed(`2`);
               break;
            case `three`:
               numPressed(`3`);
               break;
            case `four`:
               numPressed(`4`);
               break;
            case `five`:
               numPressed(`5`);
               break;
            case `six`:
               numPressed(`6`);
               break;
            case `seven`:
               numPressed(`7`);
               break;
            case `eight`:
               numPressed(`8`);
               break;
            case `nine`:
               numPressed(`9`);
               break;
            case `zero`:
               numPressed(`0`);
               break;
            case `dot`:
               dotPressed();
               break;
            case `plus`:
               actPressed(`+`, valueLength, inputValue);
               break;
            case `minus`:
               actPressed(`-`, valueLength, inputValue);
               break;
            case `multiply`:
               actPressed(`×`, valueLength, inputValue);
               break;
            case `division`:
               actPressed(`/`, valueLength, inputValue);
               break;
            case `pow`:
               actPressed(`^`, valueLength, inputValue);
               break;
            case `percent`:
               percentPressed(valueLength);
               break;
            case `delete`:
               deletePressed(valueLength);
               break;
            case `deleteAll`:
               deleteAllPressed();
               break;
         }
      }
   }
}