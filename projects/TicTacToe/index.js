// Okay: we have two players.
// One plays in X and the other in O

// Also show which player is taking a turn
// We'll use an array of legth 9
//
// We'll have to implement a function to check if a player has won...Okay this might be bit tricky.
// Check horizontal, vertical, and diagonals, yacks.

/* Okay one more thing, I have to practice a seperation of concerns  */

function Gameboard() {
  const NUMBER_OF_SQUARES = 9;
  const gameboard = new Array(NUMBER_OF_SQUARES);
  return gameboard;
}

const gameboard = Gameboard();

const GameLogic = ((gameboard) => {
  let _isPlayer1Turn = true;
  const _boxes = document.querySelectorAll('.box');

  const run = () => {
    _boxes.forEach((box) => {
      box.addEventListener('click', function () {
        let move;
        if (_isPlayer1Turn) {
          move = 'X';
        } else {
          move = 'O';
        }

        const id = this.getAttribute('id');
        console.log(this);
        const index = parseInt(id) - 1;

        if (isSquareTaken(index)) return;

        gameboard[index] = move;
        this.innerHTML = `<h3>${move}</h3>`;

        if (checkWin(move)) {
          window.alert("You have won")
          /* give a winner message, */
          /* and then allow the player to reset the game.  */
        }

        _isPlayer1Turn = !_isPlayer1Turn;
        console.log(_isPlayer1Turn)
      });
    });
  };

  const checkWin = (move) => {
    let colSize = 3;
    let isWin = true;

    // check if there is horizonatal win
    for (let row = 0; row < 3; row++) {
      isWin = true;
      for (let col = 0; col < 3; col++) {
        if (gameboard[row * colSize + col] !== move) {
          isWin = false;
          continue;
        }
      }
      if (isWin) {
        return true;
      }
    }

    // check if there is vertical win
    for (let col = 0; col < 3; col++) {
      isWin = true;
      for (let row = 0; row < 3; row++) {
        if (gameboard[row * colSize + col] !== move) {
          isWin = false;
          continue;
        }
      }
      if (isWin) {
        return true;
      }
    }

    /* check if there's a diagonal win */
    if (gameboard[0] == move && gameboard[4] == move && gameboard[8] == move) return true;
    if (gameboard[6] == move && gameboard[4] == move && gameboard[2] == move) return true;
  };

  const isSquareTaken = (index) => {
    if (gameboard[index] === 'X' || gameboard[index] === 'O') return true;
    return false;
  };

  return {
    run,
  };
})(gameboard);

GameLogic.run();
