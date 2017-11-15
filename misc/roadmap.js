function Game(){
  //this creates an object that serves as the model for the Game
  //it will hold all position and statistical information
  //it will also have methods to update that information
}

$(document).ready(function(){
  //we can either put click handlers here or link to an initialize function
  //for the board, I think we should use delegated click handlers based in a container obj
});


function resetGame(){
  //this will reset the game board
  game = new Game()
}

function buildBoard(){
  //this is the dom creation of the board, maybe make part of Game object
}

function updateDisplay(){
  //Update the board position and points in the display
}

function checkWinState(){
  //determine if a win state has been reached
  //this can maybe be accomplished purely based on turn number
}

function checkIfMoveIsLegal(){
  //on click, checks to see if the move is valid
}

function handleLegalMove(){
  //does a tree search for all possible pieces affected by move
  //updated the game objects gameboard
  //at the end calls updateDisplay()
}
