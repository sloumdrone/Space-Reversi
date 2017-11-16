$(document).ready(function(){
    //we can either put click handlers here or link to an initialize function
    //for the board, I think we should use delegated click handlers based in a container obj
    game = new Game();
    // $('.container').on('click','div.square', checkIfMoveIsLegal);
    buildBoard();
  //we can either put click handlers here or link to an initialize function
  //for the board, I think we should use delegated click handlers based in a container obj

  game = new Game();
  $('.container').on('click','div.square', handleBoardClick);
  buildBoard();
});

var game;
function Game(){
  //this creates an object that serves as the model for the Game
  //it will hold all position and statistical information
  //it will also have methods to update that information
  this.playing = true;
  this.currentPlayer = 'b';
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
    ['e','e','e','e','e','e','e','e']
  ];

  this.score = {
    'b': 2,
    'w': 2
  };

  this.updateScore = function(amount){
    this.score[this.currentPlayer] += amount + 1;
    this.score[this.getOpponentName()] -= amount;
  },

  this.checkForGameOver = function(){
    if (this.turn > 60){
      this.playing = false;
    }
  },

  this.getOpponentName = function(){
    return game.currentPlayer === 'b' ? 'w' : 'b';
  }
}

function resetGame(){
  //this will reset the game board
  game = new Game()
}


function buildBoard(){
  $('.header').text(game.currentPlayer);
  $('.whitescore').text(game.score.w);
  $('.blackscore').text(game.score.b);
  $('.container').empty();
  var createRow= $('<div>').addClass('row');
  for(var i=0; i<8;i++) {
      $('.container').append(createRow);
      for (var j = 0; j < 8; j++) {
          var blackPiece = $('<div>').addClass('black');
          var whitePiece = $('<div>').addClass('white');
          var createColumn = $('<div>', {
              class: 'square',
              attr: {
                  row: i,
                  col: j
              }
          });
          $('.row:last-child').append(createColumn);
          if (game.gameboard[i][j] === 'b') {
              $('.row:last-child .square:last-child').append(blackPiece);
          } else if (game.gameboard[i][j] === 'w') {
              $('.row:last-child .square:last-child').append(whitePiece);
          }
      }


      //this is the dom creation of the board, maybe make part of Game object
  }
}


function updateDisplay() {
        //Update the board position and points in the display
        buildBoard();
}

function checkWinState(){
  //determine if a win state has been reached
  //this can maybe be accomplished purely based on turn number
}

function checkIfMoveIsLegal(){
  console.log("Checking if Move is Legal");
  //on click, checks to see if the move is valid
}

function getOpponentName(){
  return game.currentPlayer === 'b' ? 'w' : 'b';
}

function handleBoardClick(){
  var rowAttr = $(this).attr('row');
  var colAttr = $(this).attr('col');
  var clickedPos = [Number(rowAttr), Number(colAttr)];
  handleMove(clickedPos);


    // This should get the row and col from the element that was clicked
  // It should then call handle move with an array of those elements
}

function handleMove(startingPosArr) {
    console.log('we handle this!!!!');
    var piecesFlipped = null;
    var directions = {//col then row
        'w': [0, -1],
        'nw': [-1, -1],
        'n': [-1, 0],
        'ne': [-1, 1],
        'e': [0, 1],
        'se': [1, 1],
        's': [1, 0],
        'sw': [1, -1]
    };

    var validDirections = [];
    var moveCount = 0;

    if (game.gameboard[startingPosArr[0]][startingPosArr[1]] === 'e') {
        for (item in directions) {
            checkDirection(item, startingPosArr);
            moveCount = 0;
        }

        if (validDirections.length > 0) {
            //add player's piece to board here
            for (var i = 0; i < validDirections.length; i++) {
                flipPieces(validDirections[i], startingPosArr);
            }
            game.gameboard[startingPosArr[0]][startingPosArr[1]] = game.currentPlayer;
            game.currentPlayer = game.getOpponentName();
            game.updateScore(piecesFlipped);
            updateDisplay();
            return true
        } else {
            return false;
        }

        function checkDirection(direction, startPoint) {//direction is a string (a valid key the obj)
            var currentPos = startPoint.slice();
            var newPos = [currentPos[0] + directions[direction][0], currentPos[1] + directions[direction][1]];
            console.log(newPos);
            if (newPos[0] < 8 && newPos[1] < 8){
              if (game.gameboard[newPos[0]][newPos[1]] === game.getOpponentName()) {
                  moveCount++;
                  checkDirection(direction, newPos);
              } else if (game.gameboard[newPos[0]][newPos[1]] === game.currentPlayer && moveCount > 0) {
                  validDirections.push(direction);
                  return true;
              } else {
                  return false;

              }
            }

        }


        function flipPieces(direction, startPoint) {//direction is a string (from validDirections)
            var currentPos = startPoint.slice();
            var newPos = [currentPos[0] + directions[direction][0], currentPos[1] + directions[direction][1]];
            if (game.gameboard[newPos[0]][newPos[1]] === game.getOpponentName()) {
                game.gameboard[newPos[0]][newPos[1]] = game.currentPlayer;
                piecesFlipped++;
                flipPieces(direction, newPos);

            }
        }
    }
}





// function checkIfMoveIsLegal(arr) {
//     //console.log("Checking if Move is Legal")
//     var rowPosition = arr[0];
//     var colPosition = arr[1];
//     // var currentTurn =  game.currentPlayer;
//     var lastTurn = game.getOpponentName();
//     if (game.gameboard[rowPosition][colPosition] === 'e') {
//         if (arr[rowPosition - 1, colPosition - 1] === lastTurn || arr[rowPosition - 1, colPosition] === lastTurn || arr[rowPosition - 1, colPosition + 1] === lastTurn || arr[rowPosition, colPosition - 1] === lastTurn || arr[rowPosition, colPosition + 1] === lastTurn || arr[rowPosition + 1, colPosition - 1] === lastTurn || arr[rowPosition +1, colPosition] === lastTurn || arr[rowPosition+1, colPosition + 1] === lastTurn ){
//         }
//
//         //on click, checks to see if the move is valid
