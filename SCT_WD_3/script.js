const boxes = document.querySelectorAll(".box");
const infoDisplay = document.getElementById("turnAndWinIndicator");
const resetButton = document.getElementById("resetButton");
const winLine = document.getElementById("winLine");
const invalidMove = new Audio("ting.mp3")

let gameOver = false;
let currentPlayer = "X";

// Switch turn function
const switchTurn = () => {
  return currentPlayer === "X" ? "O" : "X";
};

// Function to announce messages using speech synthesis
const announce = (message) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.5;
    window.speechSynthesis.speak(utterance);
  }
};

// Function to check if a player has won or if it's a draw
const checkWin = () => {
  let winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  winConditions.forEach((condition) => {
    if (
      boxes[condition[0]].innerText === boxes[condition[1]].innerText &&
      boxes[condition[1]].innerText === boxes[condition[2]].innerText &&
      boxes[condition[0]].innerText !== ""
    ) {
      gameOver = true;
      infoDisplay.innerHTML = `${currentPlayer} Won!`;
      announce(`${currentPlayer} Won!`);
    }
  });
  
  // Check for draw
  if (!gameOver && Array.from(boxes).every(box => box.innerText !== "")) {
    gameOver = true;
    infoDisplay.innerHTML = "It's a Draw!";
    announce("It's a Draw!");
  }
};

// Game logic
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if(gameOver||box.innerText!==""){
      invalidMove.play();
    }
    if (!gameOver && box.innerText === "") {
      box.innerText = currentPlayer;
      checkWin();
      if (!gameOver) {
        currentPlayer = switchTurn();
        infoDisplay.innerText = `Turn for ${currentPlayer}`;
        announce(`Turn for ${currentPlayer}`);
      }
    }
  });
});

// Reset the game
resetButton.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.innerText = "";
  });
  gameOver = false;
  currentPlayer = "X";
  infoDisplay.innerText = "Turn for X";
});
