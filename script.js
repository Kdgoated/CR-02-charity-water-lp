// Clean Drop game logic
// This script manages the village loop, budget, and solution choices.

const villages = [
  {
    name: 'Riverbend',
    population: 420,
    problem: 'The well water is cloudy and unsafe for families.',
    solutions: [
      { name: 'Repair the well', cost: 200, successRate: 0.9, served: 220 },
      { name: 'Filter system', cost: 350, successRate: 0.75, served: 360 },
      { name: 'Water training', cost: 150, successRate: 0.6, served: 120 }
    ]
  },
  {
    name: 'Sandy Hollow',
    population: 310,
    problem: 'The village depends on rain and needs a stable water source.',
    solutions: [
      { name: 'Rainwater tanks', cost: 180, successRate: 0.85, served: 220 },
      { name: 'Community well', cost: 300, successRate: 0.7, served: 290 },
      { name: 'Water education', cost: 120, successRate: 0.5, served: 100 }
    ]
  },
  {
    name: 'Mangrove Bay',
    population: 570,
    problem: 'Salt water makes drinking water unhealthy.',
    solutions: [
      { name: 'Clean pump', cost: 320, successRate: 0.8, served: 410 },
      { name: 'Desalination kit', cost: 420, successRate: 0.6, served: 540 },
      { name: 'Filter buckets', cost: 200, successRate: 0.7, served: 260 }
    ]
  },
  {
    name: 'Greenfield',
    population: 260,
    problem: 'Children walk far to collect unsafe water.',
    solutions: [
      { name: 'Near well', cost: 210, successRate: 0.9, served: 240 },
      { name: 'Pump repair', cost: 160, successRate: 0.8, served: 190 },
      { name: 'Health training', cost: 130, successRate: 0.6, served: 130 }
    ]
  },
  {
    name: 'Sunrise Village',
    population: 490,
    problem: 'Local pipes leak and waste water every day.',
    solutions: [
      { name: 'Pipe repair', cost: 270, successRate: 0.85, served: 340 },
      { name: 'New pump', cost: 360, successRate: 0.7, served: 430 },
      { name: 'Water lessons', cost: 140, successRate: 0.55, served: 160 }
    ]
  }
];

const budgetEl = document.getElementById('budget');
const peopleServedEl = document.getElementById('people-served');
const villageNumberEl = document.getElementById('village-number');
const villageTotalEl = document.getElementById('village-total');
const villageNameEl = document.getElementById('village-name');
const villagePopulationEl = document.getElementById('village-population');
const villageProblemEl = document.getElementById('village-problem');
const resultBox = document.getElementById('result-box');
const solutionButtons = [
  document.getElementById('solution-0'),
  document.getElementById('solution-1'),
  document.getElementById('solution-2')
];
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');

let budget = 1000;
let peopleServed = 0;
let currentVillageIndex = 0;
let villageComplete = false;

function updateStatus() {
  budgetEl.textContent = budget;
  peopleServedEl.textContent = peopleServed;
  villageNumberEl.textContent = currentVillageIndex + 1;
  villageTotalEl.textContent = villages.length;
}

function showVillage() {
  const village = villages[currentVillageIndex];
  villageNameEl.textContent = village.name;
  villagePopulationEl.textContent = village.population;
  villageProblemEl.textContent = village.problem;
  resultBox.textContent = 'Choose a solution to help this village.';
  nextButton.style.display = 'none';
  restartButton.style.display = 'none';
  villageComplete = false;

  village.solutions.forEach((solution, index) => {
    const button = solutionButtons[index];
    button.textContent = `${solution.name} — $${solution.cost}`;
    button.disabled = false;
  });
}

function completeVillage(message) {
  resultBox.textContent = message;
  villageComplete = true;
  nextButton.style.display = 'inline-block';
  solutionButtons.forEach(button => {
    button.disabled = true;
  });
}

function chooseSolution(index) {
  if (villageComplete) {
    return;
  }

  const village = villages[currentVillageIndex];
  const solution = village.solutions[index];

  if (budget < solution.cost) {
    resultBox.textContent = 'Not enough funds for that choice. Pick a different solution.';
    return;
  }

  budget -= solution.cost;

  const success = Math.random() < solution.successRate;
  if (success) {
    const served = Math.min(village.population, solution.served);
    peopleServed += served;
    completeVillage(`Success! ${served} people now have better access to clean water.`);
  } else {
    completeVillage('The choice did not work as planned. The village still needs water, but you can try the next one.');
  }

  updateStatus();
}

function nextVillage() {
  currentVillageIndex += 1;
  if (currentVillageIndex >= villages.length) {
    showGameOver();
    return;
  }
  showVillage();
  updateStatus();
}

function showGameOver() {
  villageNameEl.textContent = 'Game Over';
  villagePopulationEl.textContent = '-';
  villageProblemEl.textContent = 'You have completed the village loop.';
  resultBox.textContent = `Final result: ${peopleServed} people helped with a remaining budget of $${budget}.`;
  nextButton.style.display = 'none';
  restartButton.style.display = 'inline-block';
  solutionButtons.forEach(button => {
    button.disabled = true;
    button.textContent = 'Game over';
  });
}

function restartGame() {
  budget = 1000;
  peopleServed = 0;
  currentVillageIndex = 0;
  updateStatus();
  showVillage();
}

solutionButtons.forEach((button, index) => {
  button.addEventListener('click', () => chooseSolution(index));
});

nextButton.addEventListener('click', nextVillage);
restartButton.addEventListener('click', restartGame);

updateStatus();
showVillage();
