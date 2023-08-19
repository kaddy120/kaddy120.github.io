const endGameScreen = document.querySelector('#win');

function restartGame() {}

endGameScreen.addEventListener('click', () => {
  endGameScreen.classList.remove('box--show');
});
endGameScreen.addEventListener('keypress', (event) => {
  console.log(event);
});

/* ---------------------  Gameboard model----------------------------- */

function Game() {
  const NUMBER_OF_SQUARES = 9;
  const gameboard = new Array(NUMBER_OF_SQUARES);
  const squareIsTaken = (index) => {
    if (gameboard[index] === 'X' || gameboard[index] === 'O') return true;
    return false;
  };

  const placeMove = (move, index) => {
    if (squareIsTaken(index)) {
      return -1;
    }
    gameboard[index] = move;
  };

  const checkWin = (move) => {
    let colSize = 3;
    let isWin = true;

    /* check if there is horizonatal win */
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

    /* check if there is vertical win */
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

  return { gameboard, placeMove, checkWin };
}

const game = Game();

/* ---------------------  Players model----------------------------- */

const playerType = {
  HUMAN: 'human',
  BOT: 'bot',
};

function player(name, move, type = playerType.HUMAN) {
  player.isPlayer1Turns = true;
  player.tie = 0;

  if (name.length > 7) {
    console.error('Use a short name, less than  7 characters.');
    return -1;
  }
  return {
    wins: 0,
    type,
    name,
    move,
  };
}

let player1 = player('you', 'X');
let player2 = null;

/* ---------------------  Splash Screen----------------------------- */

/* splash model */
const settings = {
  opponent: playerType.HUMAN,
  names: { player1: 'king', player2: 'frank' },
  player1Move: 'X',
  player2Move: 'O',
};

const humanBotToggle = document.getElementById('human-bot-toggle');
const xoToggle = document.getElementById('X-O-toggle');

humanBotToggle.addEventListener('change', () => {
  if (humanBotToggle.checked) {
    settings.opponent = playerType.BOT;
    settings.names.player2 = playerType.BOT;
  } else {
  }
});

xoToggle.addEventListener('change', () => {
  if (xoToggle.checked) {
    settings.player1Move = 'O';
    settings.player2Move = 'X';
  } else {
    settings.player1Move = 'X';
    settings.player2Move = 'O';
  }
});

function start() {
  const _splash = document.querySelector('.splash');
  const _game = document.querySelector('.game');

  player1 = player(
    settings.names.player1,
    settings.player1Move,
    playerType.HUMAN
  );
  player2 = player(
    settings.names.player2,
    settings.player2Move,
    settings.opponent
  );

  _splash.classList.add('hide');
  _game.classList.add('box--show');
}

let players = [player1, player2];
// OH I see, instead created some data from the mode splash, then send it when you press statr
/* ------------------------------------------------------------------- */

/* ---------------------- View ---------------------------------------*/

function view() {
  let _results = document.querySelector('.results');
  let _winner = document.querySelector('#win');
  let winner = document.getElementsByClassName('winner');
  let _endGameScreen = document.querySelector('.win');
  let _restartButton = document.querySelector('#restart');
  let _turnX = document.querySelector('.player-X');
  let _turnO = document.querySelector('.player-O');
  const _boxes = document.querySelectorAll('.box');

  const updateScores = () => {};

  const changeTurn = () => {};

  const turn = (move) => {
    if (move == 'X') {
      _turnO.classList.add('playing');
      _turnX.classList.remove('playing');
    } else {
      _turnO.classList.remove('playing');
      _turnX.classList.add('playing');
    }
  };

  const showEndgameScreen = () => {
    _results.classList.remove('hide');
    _endGameScreen.classList.add('box--show');
  };

  const getIndex = (box) => {
    const id = box.getAttribute('id');
    return parseInt(id) - 1;
  };

  const placeMove = (box, move) => {
    box.innerHTML = `<h2 class="${move}">${move}</h2>`;
  };

  const restart = () => {
    _restartButton.addEventListener('click', function () {
      /* show that it's X turn  */
      turn('O');
      _boxes.forEach((box) => {
        box.innerHTML = '<h2></h2>';
      });
      _results.classList.add('hide');
    });
  };
  return {
    updateScores,
    changeTurn,
    turn,
    showEndgameScreen,
    placeMove,
    getIndex,
    restart,
    boxes: _boxes,
  };
}

const GameLogic = (({ gameboard, placeMove, checkWin }, players) => {
  let _movesCount = 0;
  let _isPlayer1Turn = true;
  const _view = view();
  const run = () => {
    _view.restart();
    _view.boxes.forEach((box) => {
      box.addEventListener('click', function () {
        let move;
        if (_isPlayer1Turn) {
          move = 'X';
          _view.turn(move);
        } else {
          move = 'O';
          _view.turn(move);
        }
        const index = _view.getIndex(box);
        if (placeMove(move, index) == -1) return;

        _view.placeMove(box, move);
        /* TODO
         1. The game stop after win
        */
        _movesCount++;
        if (checkWin(move)) {
          _view.showEndgameScreen();
          gameboard.fill(0);
          _movesCount = 0;
          return;
        } else if (_movesCount === 9) {
          gameboard.fill(0);
          _movesCount = 0;
          /* game is tie */
          /* _results.classList.remove('hide'); */
          return;
        }
        _isPlayer1Turn = !_isPlayer1Turn;
      });
    });
  };

  return {
    run,
  };
})(game, players);

GameLogic.run();
