function Game(){
  //this creates an object that serves as the model for the Game
  //it will hold all position and statistical information
  //it will also have methods to update that information
  this.playing = true;
  this.currentPlayer = 'black';
  this.turn = 1;
  this.winner = null;

  //'e'=empty, 'w'=white, 'b'=black, 'l'=legal
  this.gameboard = [
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','b','w','e','e','e'],
    ['e','e','e','w','b','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
  ];
  this.score = {
    'black': 2,
    'white':2
  };

  this.updateScore = function(amount){
    var otherPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    this.score[this.currentPlayer] += amount;
    this.score[otherPlayer] -= amount;
  }

  this.checkForGameOver = function(){
    if (this.turn > 60){
      this.playing = false;

    }
  }
}

$(document).ready(function(){
  //we can either put click handlers here or link to an initialize function
  //for the board, I think we should use delegated click handlers based in a container obj
  var game = new Game();
  $('.container div.square').on('click',checkIfMoveIsLegal);
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
  console.log("Checking if Move is Legal");
  //on click, checks to see if the move is valid
}

function handleLegalMove(){
  var piecesFlipped = null;
  //does a tree search for all possible pieces affected by move
  //updated the game objects gameboard
  game.updateScore(piecesFlipped);
  updateDisplay();
}
