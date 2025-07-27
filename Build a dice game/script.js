const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

const rollDice = () => {
  diceValuesArr = [];

  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  }

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScoreElement.textContent = score;
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

const getHighestDuplicates = (arr) => {
  const counts = {};
  for (const num of arr) {
    counts[num] = (counts[num] || 0) + 1;
  }

  const highestCount = Math.max(...Object.values(counts));
  const sumOfAllDice = arr.reduce((a, b) => a + b, 0);

  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice); // Four of a kind
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice); // Three of a kind
  }
};

const detectFullHouse = (arr) => {
  const counts = {};
  for (const num of arr) {
    counts[num] = (counts[num] || 0) + 1;
  }

  const values = Object.values(counts);
  const hasThreeOfAKind = values.includes(3);
  const hasPair = values.includes(2);

  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2, 25); // Full house
  }
};

const checkForStraights = (arr) => {
  const sorted = arr.slice().sort((a, b) => a - b);
  const unique = [...new Set(sorted)];
  const uniqueStr = unique.join("");

  const smallStraights = ["1234", "2345", "3456"];
  const largeStraights = ["12345", "23456"];

  if (smallStraights.some(straight => uniqueStr.includes(straight))) {
    updateRadioOption(3, 30); // Small straight
  }

  if (largeStraights.includes(uniqueStr)) {
    updateRadioOption(4, 40); // Large straight
  }
};

const resetRadioOptions = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  round = 1;
  rolls = 0;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScoreElement.textContent = score;
  scoreHistory.innerHTML = "";
  updateStats();
  resetRadioOptions();
};

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;
    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr);

    // ✅ Enable "None of the Above" only once
    updateRadioOption(5, 0);
  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;
  rulesBtn.textContent = isModalShowing ? "Hide rules" : "Show rules";
  rulesContainer.style.display = isModalShowing ? "block" : "none";
});

keepScoreBtn.addEventListener("click", () => {
  let selectedValue = null;
  let achieved = "";

  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);

    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${score}`);
        resetGame();
      }, 500);
    }
  } else {
    alert("Please select an option or roll the dice");
  }
});
