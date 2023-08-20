/* ------  Splash Screen----- */

function SplashScreen() {
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

  let players = [player1, player2];

  /* To-Do: make sure the game is starting */
  const start = () => {
    const _splash = document.querySelector('.splash');
    const _game = document.querySelector('.game');
    _splash.classList.add('hide');
    _game.classList.add('box--show');
  };

  let activePlayer = players[0];
}

function GameScreen() {
  let _results = document.querySelector('.results');
  let _restartButton = document.querySelector('#restart');
  let _turnX = document.querySelector('.player-X');
  let _turnO = document.querySelector('.player-O');
  const _boxes = document.querySelectorAll('.box');

  const turn = (move) => {
    if (move == 'X') {
      _turnO.classList.add('playing');
      _turnX.classList.remove('playing');
    } else {
      _turnO.classList.remove('playing');
      _turnX.classList.add('playing');
    }
  };

  const getIndex = (box) => {
    const id = box.getAttribute('id');
    return parseInt(id) - 1;
  };

  const placeMove = (box, move) => {
    box.innerHTML = `<h2 class="${move}">${move}</h2>`;
  };

  const updateScores = () => {};

  const changeTurn = () => {};

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
}

function GameEndScreen() {
  const endGameScreen = document.querySelector('#win');

  function restartGame() {}

  endGameScreen.addEventListener('click', () => {
    endGameScreen.classList.remove('box--show');
  });
  endGameScreen.addEventListener('keypress', (event) => {
    console.log(event);
  });
}

function ScreenController() {
  let _winner = document.querySelector('#win');
  let winner = document.getElementsByClassName('winner');
  let _endGameScreen = document.querySelector('.win');

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

  const showEndgameScreen = () => {
    _results.classList.remove('hide');
    _endGameScreen.classList.add('box--show');
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  return {}; 
}

