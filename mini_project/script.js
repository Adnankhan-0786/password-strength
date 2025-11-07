const inputSlider = document.querySelector('[data-lengthslider]');
const lengthdisplay = document.querySelector('[data-lengthnumber]');
const passworddisplay = document.querySelector('[data-passworddisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copymsg = document.querySelector('[data-copymsg]');
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const numbers = document.querySelector('#numbers');
const symbols = document.querySelector('#symbol');
const indicator = document.querySelector('[data-indecator]');
const generateBtn = document.querySelector('.generate');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbolList = '`~!@#$%^&*()_-+={[}]|:;"<>,.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleslider();
console.log("starting the journey");

function handleslider() {
  inputSlider.value = passwordLength;
  lengthdisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInt(0, 10).toString();
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInt(97, 123));
}

function generateupperCase() {
  return String.fromCharCode(getRandomInt(65, 91));
}

function generateSymbol() {
  const randomNum = getRandomInt(0, symbolList.length);
  return symbolList.charAt(randomNum);
}

function calculateStrength() {
  let hasupper = uppercase.checked;
  let haslower = lowercase.checked;
  let hasnumber = numbers.checked;
  let hassymbol = symbols.checked;

  if (hasupper && haslower && hasnumber && hassymbol && passwordLength >= 8) {
    setIndicator('green');
  } else if ((hasupper || haslower) && (hasnumber || hassymbol) && passwordLength >= 6) {
    setIndicator("orange");
  } else {
    setIndicator("red");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passworddisplay.value);
    copymsg.innerText = "copied";
    passworddisplay.value = ""; // Display clear after copy
  } catch (e) {
    copymsg.innerText = "failed";
  }
  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 1000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckboxChange);
});

inputSlider.addEventListener('input', (e) => {
  passwordLength = parseInt(e.target.value);
  handleslider();
});

copyBtn.addEventListener('click', () => {
  if (passworddisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener('click', () => {
  if (checkCount <= 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }

  // Build array of functions to use
  let funcArr = [];
  if (uppercase.checked) funcArr.push(generateupperCase);
  if (lowercase.checked) funcArr.push(generateLowerCase);
  if (numbers.checked) funcArr.push(generateRandomNumber);
  if (symbols.checked) funcArr.push(generateSymbol);

  // Compulsory addition
  let generatedPassword = [];
  funcArr.forEach((func) => {
    generatedPassword.push(func());
  });

  // Remaining characters
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInt(0, funcArr.length);
    generatedPassword.push(funcArr[randIndex]());
  }

  // Shuffle and show
  password = shufflePassword(generatedPassword);
  passworddisplay.value = password;
  calculateStrength();
});