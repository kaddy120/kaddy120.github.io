export default function GameController(players) {
  const _board = Gameboard();
  let _movesCount = 0;
  let _isPlayer1Turn = true;
  let _activePlayer = players[0].token;

  const switchPlayerTurn = () => {
    _activePlayer === players[0].token ? players[1].token : players[0].token;
  };

  const getActivePlayer = () => _activePlayer;

  const playRound = (index) => {
    if (_board.placeMove(getActivePlayer().token, index) == -1) return -1;
    switchPlayerTurn();
  };

  const checkWin = (token) => {
    const board = _board.getBoard();
    let colSize = _board.getCols();
    let isWin = true;

    /* check if there is horizonatal win */
    for (let row = 0; row < 3; row++) {
      isWin = true;
      for (let col = 0; col < 3; col++) {
        if (board[row * colSize + col] !== token) {
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
        if (board[row * colSize + col] !== token) {
          isWin = false;
          continue;
        }
      }
      if (isWin) {
        return true;
      }
    }

    /* check if there's a diagonal win */
    if (board[0] == token && board[4] == token && board[8] == token)
      return true;
    if (board[6] == token && board[4] == token && board[2] == token)
      return true;
  };

  return { playRound, checkWin };
}
