// Okay: we have two players.
// One plays in X and the other in O

// Also show which player is taking a turn
// We'll use an array of legth 9
//
// We'll have to implement a function to check if a player has won...Okay this might be bit tricky.
// Check horizontal, vertical, and diagonals, yacks.
//
//

let playing
const boxes = document.querySelectorAll('.box');
console.log(boxes);
boxes.forEach((box) => {
        console.log(box);
        box.addEventListener('click', handleClick);
});

function handleClick() {
        let move = 'X';
        this.innerHTML= `<h3>${move}</h3>`;
}
