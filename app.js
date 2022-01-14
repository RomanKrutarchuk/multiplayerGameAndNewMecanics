const body = document.querySelector(".body");
let scoreOfPlayer1;
let scoreOfPlayer2;
const wrapper = document.querySelector(".wrapper");
const globalContainer = document.querySelector(".globalContainer");
let phase = "move";
let bordSize = 3;
let gatePosition;
const gameState = "";
let GameFinished = false;
let playerWhoWalks;
let playerWhoWaits;
let score = { player1: 0, player2: 0 };
let gate1;
let gate2;
let boxFromButton;
let difficultyTextbox;
let scoreBoard;
let button_Remove;
function removeButtonOfDifficulty() {
  button_Remove.remove();
}
function createButtonOfDifficulty() {
  button_Remove = document.createElement("div");
  button_Remove.classList.add("buttonOfRemove");
  button_Remove.innerHTML = "Difficulty";
  body.append(button_Remove);
  button_Remove.addEventListener("click", function () {
    changeTheDifficultyOperator();
    removeBoard();
    removeScoreBoard();
    removeButtonOfDifficulty();
  });
}
function removeScoreBoard() {
  scoreBoard.remove();
}
function scoreOfGame() {
  scoreBoard = document.createElement("div");
  scoreBoard.classList.add("scoreBoard");
  body.append(scoreBoard);
  scoreOfPlayer1 = document.createElement("div");
  scoreOfPlayer1.classList.add("scoreOfPlayer1");
  scoreBoard.append(scoreOfPlayer1);
  scoreOfPlayer1.innerHTML = "0";
  scoreOfPlayer2 = document.createElement("div");
  scoreOfPlayer2.classList.add("scoreOfPlayer2");
  scoreBoard.append(scoreOfPlayer2);
  scoreOfPlayer2.innerHTML = "0";
}
function createDifficultyTextBox() {
  difficultyTextbox = document.createElement("div");
  difficultyTextbox.classList.add("changeTheDifficultyTextBox");
  difficultyTextbox.innerHTML = "Change the difficulty";
  body.append(difficultyTextbox);
}
function changeTheDifficulty(num_of_column) {
  let number_of_repeat = num_of_column ** 2
  const btn = document.createElement("div");
  btn.classList.add("initButton");
  btn.style.gridTemplateColumns = `repeat(${num_of_column}, auto)`;
  boxFromButton.append(btn);
  for (let i = 0; i < number_of_repeat; i++) {
    const microBoxOfButton = document.createElement("div");
    microBoxOfButton.classList.add("microBoxOfButton");
    btn.append(microBoxOfButton);
  }
  btn.addEventListener("click", function () {
    removeBoard();
    bordSize = num_of_column;
    initGame();
    scoreOfGame();
    boxFromButton.remove();
    createButtonOfDifficulty();
    difficultyTextbox.remove();
  });
}
function changeTheDifficultyOperator() {
  boxFromButton = document.createElement("div");
  boxFromButton.classList.add("boxFromButton");
  body.append(boxFromButton);
  createDifficultyTextBox();
  changeTheDifficulty(3);
  changeTheDifficulty(5);
  changeTheDifficulty(7);
}
function handelClick(x, y) {
  if (GameFinished === true) {
    return;
  }
  if (phase == "move") {
    if (moveChip(x, y)) {
      if (isGameFinished()) {
        GameFinished = true;
        setTimeout(createFinishScreen, 500);
      } else {
        phase = "block";
      }
    }
  } else if (phase == "block") {
    if (blockCell(x, y)) {
      phase = "move";
      swapPlayers();
      markPlayer();
    }
  }
}
function moveChip(x, y) {
  if (isItANeighbourCell(playerWhoWalks, { x, y }) && accessibleCell(x, y)) {
    playerWhoWalks.x = x;
    playerWhoWalks.y = y;
    playerWhoWalks.circle.style.left = (100 / bordSize) * (x - 1) + "%";
    playerWhoWalks.circle.style.top = (100 / bordSize) * (y - 1) + "%";

    return true;
  } else {
    return false;
  }
}
function blockCell(x, y) {
  const currentCell = document.querySelector(".box-" + x + "-" + y);
  if (
    currentCell.classList.contains("blocked") ||
    currentCell.classList.contains("gate") ||
    (playerWhoWalks.x === x && playerWhoWalks.y === y) ||
    (playerWhoWaits.x === x && playerWhoWaits.y === y)
  ) {
    return false;
  } else {
    document.querySelector(".box-" + x + "-" + y).classList.add("blocked");
    return true;
  }
}
function isItANeighbourCell(from, to) {
  return Math.abs(from.x - to.x) <= 1 && Math.abs(from.y - to.y) <= 1;
}
function accessibleCell(x, y) {
  return (
    !(playerWhoWalks.x === x && playerWhoWalks.y === y) &&
    !(playerWhoWaits.x == x && playerWhoWaits.y == y) &&
    !document.querySelector(".box-" + x + "-" + y).classList.contains("blocked")
  );
}
function createBoard() {
  wrapper.style.gridTemplateColumns = `repeat(${bordSize}, auto)`;
  wrapper.style.gridTemplateRows = `repeat(${bordSize}, auto)`;

  for (let y = 1; y <= bordSize; y++) {
    for (let x = 1; x <= bordSize; x++) {
      let newElement = document.createElement("div");
      newElement.addEventListener("click", function () {
        handelClick(x, y);
      });
      newElement.classList.add("box", "box-" + x + "-" + y);
      wrapper.append(newElement);
    }
  }

  wrapper.querySelector(`.box-${gate1.x}-${gate1.y}`).classList.add("gate");
  wrapper.querySelector(`.box-${gate2.x}-${gate2.y}`).classList.add("gate");
}
function createChip(circleName, position) {
  const circle = document.createElement("div");
  circle.classList.add(circleName);
  wrapper.append(circle);
  circle.style.left = (100 / bordSize) * (position.x - 1) + "%";
  circle.style.top = (100 / bordSize) * (position.y - 1) + "%";
  circle.style.width = 100 / bordSize + "%";
  circle.style.height = 100 / bordSize + "%";
  return { x: position.x, y: position.y, circle: circle };
}
function initGame() {
  gatePosition = Math.ceil(bordSize / 2);
  gate1 = { x: gatePosition, y: 1 };
  gate2 = { x: gatePosition, y: bordSize };
  createBoard();
  playerWhoWalks = selfPlayer = createChip("circle1", gate1);
  playerWhoWaits = opponentPlayer = createChip("circle2", gate2);
  markPlayer();
  GameFinished = false;
  phase == "move";
}
function rotateBoard() {
  document.querySelector(".container").classList.toggle("containerRotate");
}
function swapPlayers() {
  if (playerWhoWalks === opponentPlayer) {
    playerWhoWalks = selfPlayer;
    playerWhoWaits = opponentPlayer;
  } else {
    playerWhoWalks = opponentPlayer;
    playerWhoWaits = selfPlayer;
  }
}
function getAdversaryGate() {
  if (playerWhoWalks === opponentPlayer) {
    return gate1;
  } else {
    return gate2;
  }
}
function isGameFinished() {
  const adversaryGate = getAdversaryGate();
  if (
    playerWhoWalks.x === adversaryGate.x &&
    playerWhoWalks.y === adversaryGate.y
  ) {
    return true;
  } else {
    return false;
  }
}
function createFinishScreen() {
  const finishScreen = document.createElement("div");
  finishScreen.classList.add("finishGame");
  globalContainer.append(finishScreen);
  const button = document.createElement("button");
  button.classList.add("finishTextButton");
  finishScreen.append(button);
  button.textContent = "RESTART";
  button.addEventListener("click", function () {
    restartGame();
  });
  if (playerWhoWalks.circle.classList.contains("circle1")) {
    finishScreen.textContent = "player 1 win";
    finishScreen.classList.add("finishGame");
    score.player1 += 1;
    scoreOfPlayer1.innerHTML = score.player1;
  } else if (playerWhoWalks.circle.classList.contains("circle2")) {
    finishScreen.textContent = "player 2 win";
    finishScreen.classList.add("finishGame");
    score.player2 += 1;
    scoreOfPlayer2.innerHTML = score.player2;
  }
  finishScreen.append(button);
}
function removeFinishScren() {
  globalContainer.querySelector(".finishGame").remove();
}
function removeBoard() {
  wrapper.innerHTML = "";
}
function restartGame() {
  removeFinishScren();
  removeBoard();
  setTimeout(initGame, 1000);
}
function markPlayer() {
  playerWhoWalks.circle.classList.add("playerWhoWalks");
  playerWhoWaits.circle.classList.remove("playerWhoWalks");
}
changeTheDifficultyOperator();

//задача
// function updateLight(current) {
//   if(current === 'green'){
//     return 'yellow'
//   } else if(current === 'yellow'){
//     return 'red'
//   } else if(current === 'red'){
//     return 'green'
//   }
// }

// задача с трансформированием текста в числа:

// function uniTotal(string) {
//   let result = 0;
//   let separateString = '';
//   for (let i = 0; i < string.length; i++) {
//     console.log(string[i]);
//     separateString = string[i]
//     if(separateString === 'a'){
//       result = 100
//     }
//   }
//   return result
// }
// console.log(uniTotal("bcd"));
