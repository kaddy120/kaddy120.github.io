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

/* What  i want to do here is to crate to player, human, or bot.  */
/* keep a record of each player score */
/* give each player a name */

function Player(){

}


function start(){
  const _splash = document.querySelector('.splash')
  const _game = document.querySelector('.game')

  _splash.classList.add('hide')
  _game.classList.remove('hide')
  /* console.log("begin") */
}

// JavaScript to handle the sliding button toggle
// JavaScript to handle the human-bot slider toggle
const humanBotToggle = document.getElementById('human-bot-toggle');

humanBotToggle.addEventListener('change', () => {
    if (humanBotToggle.checked) {
        // Perform actions when the slider is on the "Bot" option
        console.log('Bot mode selected');
    } else {
        // Perform actions when the slider is on the "Human" option
        console.log('Human mode selected');
    }
});

const GameLogic = ((gameboard) => {
  let _results = document.querySelector('.results');
  let _winner = document.querySelector('#winner');
  let _restartButton = document.querySelector('#restart');
  let _turnX = document.querySelector('.player-X');
  let _turnO = document.querySelector('.player-O');
  let _isPlayer1Turn = true;
  let _movesCount = 0;
  const _boxes = document.querySelectorAll('.box');


  const run = () => {
    restart();
    _boxes.forEach((box) => {
      box.addEventListener('click', function() {
        console.log('you clicked me');
        let move;
        if (_isPlayer1Turn) {
          move = 'X';
          turn(move);
          /* _turn.innerHTML ='X' */
        } else {
          move = 'O';
          turn(move);
          /* _turn.innerHTML ='O' */
        }

        const id = this.getAttribute('id');
        console.log(this);
        const index = parseInt(id) - 1;

        if (isSquareTaken(index)) return;

        gameboard[index] = move;
        this.innerHTML = `<h2 class="${move}">${move}</h2>`;

        _movesCount++;
        /* Okay, the only thing that I'm left with is enuring that a player doesn't continue playing after a win */
        if (checkWin(move)) {
          _results.classList.remove('hide');
          _winner.innerHTML = move;
          return;
        } else if (_movesCount === 9) {
          _results.classList.remove('hide');
          let winner = document.getElementsByClassName('winner');
          winner.innerHTML = '';
          return;
        }

        _isPlayer1Turn = !_isPlayer1Turn;
        console.log(_isPlayer1Turn);
      });
    });
  };

  const turn = (move) => {
    if (move == 'X') {
      _turnO.classList.add('playing');
      _turnX.classList.remove('playing');
    } else {
      _turnO.classList.remove('playing');
      _turnX.classList.add('playing');
    }
  };

  const restart = () => {
    _restartButton.addEventListener('click', function() {
      /* show that it's X turn  */
      turn('O');
      gameboard.fill(0);
      _movesCount = 0;
      _boxes.forEach((box) => {
        box.innerHTML = '<h2></h2>';
      });
      _results.classList.add('hide');
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
    if (gameboard[0] == move && gameboard[4] == move && gameboard[8] == move)
      return true;
    if (gameboard[6] == move && gameboard[4] == move && gameboard[2] == move)
      return true;
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
