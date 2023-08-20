
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const NUMBER_OF_SQUARES = rows * columns;

  const gameboard = new Array(NUMBER_OF_SQUARES);
  gameboard.fill(0);

  const placeMove = (move, index) => {
    if (squareIsTaken(index)) {
      return -1;
    }
    gameboard[index] = move;
  };

  const squareIsTaken = (index) => {
    if (gameboard[index] === 'X' || gameboard[index] === 'O') return true;
    return false;
  };

  const getBoard = () => gameboard;
  const getRows = () => rows;
  const getCols = () => columns;

  const clearBoard = () => {
    gameboard.fill(0);
  };

  return { getBoard, placeMove, getCols, clearBoard };
}

