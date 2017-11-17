$(document).ready(function(){
      $('span').click(function() {
        $('.modal').css('display', 'none');
      });

    //   $('window').click(function() {
    //     if (event.target === modal) {
    //       $('.modal').css('display', 'none');
    //     }
    //   });
    //we can either put click handlers here or link to an initialize function
    //for the board, I think we should use delegated click handlers based in a container obj
    game = new Game();
    // $('.container').on('click','div.square', checkIfMoveIsLegal);
    updateDisplay();
  //we can either put click handlers here or link to an initialize function
  //for the board, I think we should use delegated click handlers based in a container obj

  game = new Game();
  $('.hamburger').on('click',hamburgerMenu);
  $('.reset-game').on('click',resetGame);
  $('.container').on('click','div.square', handleBoardClick);
  $('.turn#firstPlayer').toggleClass('thingy');
  $('#secondPlayerPassDiv').toggleClass('passBtnClass');
  $('.passBtn1').click(checkSameRound);
  $('.passBtn2').click(checkSameRound);
  $('.toggle-slider-body').click(function(){
    if (game.mode === 'ai'){
      $('.toggle-slider-disc').css('float','left');
      game.mode = 'human';
      game.clickable = true;
    } else {
      $('.toggle-slider-disc').css('float','right');
      game.mode = 'ai';
    }
  });
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
  this.menuOut = false;
  this.legalMoves = [];
  this.playerOneScore= null;
  this.newPlayerOneScore= null;
  this.playerTwoScore= null;
  this.newPlayerTwoScore= null;
  this.passButtClick = 0;
  this.mode = 'ai';
  this.clickable = true;

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

  this.directions = {//col then row
      'w' : [ 0, -1],
      'nw': [-1, -1],
      'n' : [-1,  0],
      'ne': [-1,  1],
      'e' : [ 0,  1],
      'se': [ 1,  1],
      's' : [ 1,  0],
      'sw': [ 1, -1]
  };

  this.score = {
    'b': 2,
    'w': 2
  };

  this.updateScore = function(amount){
    this.score[this.currentPlayer] += amount + 1;
    this.score[this.getOpponentName()] -= amount;
    this.turn++;
    console.log(this.turn);

  },

  this.checkForGameOver = function(){
      var cellCounter=0;
      for(var i=0; i<8; i++){
          for (var j=0; j<8; j++){
              if(this.gameboard[i][j]==="w"|| this.gameboard[i][j]==="b"){
                  cellCounter++;
              }
          }
      }
      console.log("THis is cell counter"+ cellCounter);
      if(cellCounter===63){
          checkWinState();
      }
    // if (this.turn > 60){
    //   this.playing = false;
    //   checkWinState();
    // }
  },

  this.getOpponentName = function(){
    return game.currentPlayer === 'b' ? 'w' : 'b';
  }
}

function resetGame(){
  //this will reset the game board
  $('.hamburger').css({'transform':'rotateZ(0deg)','right':'2vw'});
  $('.slider-menu').css({'right':'-20vw'});
  if (game.currentPlayer === 'b'){
    $('.turn#firstPlayer').toggleClass('thingy');
    $('.turn#secondPlayer').toggleClass('thingy2');
    $('#firstPlayerPassDiv').toggleClass('passBtnClass');
    $('#secondPlayerPassDiv').toggleClass('passBtnClass');
  }
  game.menuOut = false;
  game = new Game();
  buildBoard();
}


function buildBoard(){
    $('.turn#topFirstPlayer').text('Points : ' + game.score.w);
    $('.turn#topSecondPlayer').text('Points : ' + game.score.b);
    $('.turn#firstPlayer').toggleClass('thingy');
    $('.turn#secondPlayer').toggleClass('thingy2');
    $('#firstPlayerPassDiv').toggleClass('passBtnClass');
    $('#secondPlayerPassDiv').toggleClass('passBtnClass');




    // if(game.currentPlayer === 'b') {
    //     $('#firstPlayer').text('Your Turn');
    // }else if(game.currentPlayer === 'w'){
    //     $('#secondPlayer').text('Your Turn');
    //
    // }
  // $('.whitescore').text(game.score.w);
  // $('.blackscore').text(game.score.b);

  $('.container').empty();
  // var createRow= $('<div>').addClass('row');
  for(var i=0; i<8;i++) {
      $('<div>').addClass('row').appendTo('.container');
      for (var j = 0; j < 8; j++) {
          var blackPiece = $('<div>').addClass('black');
          var whitePiece = $('<div>').addClass('white');
          var legalMove = $('<div>').addClass('legalMove');
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
          } else if (game.gameboard[i][j] === 'l') {
              $('.row:last-child .square:last-child').append(legalMove);
          }
      }


      //this is the dom creation of the board, maybe make part of Game object
  }
}

function hamburgerMenu(){
  if (!game.menuOut){
    $(this).css({'transform':'rotateZ(90deg)','right':'22vw'});
    $('.slider-menu').css({'right':'0'});
    game.menuOut = true;
  } else {
    $(this).css({'transform':'rotateZ(0deg)','right':'2vw'});
    $('.slider-menu').css({'right':'-20vw'});
    game.menuOut = false;
  }

}


function updateDisplay() {
        //Update the board position and points in the display
        checkForLegalMoves();
        buildBoard();
}

function checkWinState(){
  //determine if a win state has been reached
  //this can maybe be accomplished purely based on turn number
  if (true) {
    console.log('win');
    $('.modal').css('display', 'block');
  }

  // $(window).click(function() {
  //   if (event.target.className === 'modal-content') {
  //     return;
  //   }
  //   $('.modal').css('display', 'none');
  // });
}

function checkForLegalMoves(){
  game.legalMoves = [];
  for(var i=0; i<8;i++) {
    for (var j = 0; j < 8; j++) {
      var validDirections = [];
      var moveCount = 0;
      var startingPos = [i,j];

      if (game.gameboard[startingPos[0]][startingPos[1]] === 'e' || game.gameboard[startingPos[0]][startingPos[1]] === 'l') {
        for (item in game.directions) {
          checkDirection(item, startingPos);
          moveCount = 0;
        }
        if (validDirections.length > 0){
          game.legalMoves.push(startingPos);
          game.gameboard[i][j] = 'l'
        } else {
          game.gameboard[i][j] = 'e'
        }
      }

    }
  }


  function checkDirection(direction, startPoint) {//direction is a string (a valid key the obj)
      var currentPos = startPoint.slice();
      var newPos = [currentPos[0] + game.directions[direction][0], currentPos[1] + game.directions[direction][1]];
      if (newPos[0] < 8 && newPos[1] < 8 && newPos[0] >= 0 && newPos[1] >= 0){
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
}

function getOpponentName(){
  return game.currentPlayer === 'b' ? 'w' : 'b';
}

function handleBoardClick(){
  var rowAttr = $(this).attr('row');
  var colAttr = $(this).attr('col');
  var clickedPos = [Number(rowAttr), Number(colAttr)];
  game.checkForGameOver();
  if (game.clickable && game.playing){
      handleMove(clickedPos);
  }
}


function aiMove(){
  console.log(game.legalMoves);
  if (game.legalMoves.length > 0){
    var randomMove = Math.floor(Math.random() * game.legalMoves.length);
    handleMove(game.legalMoves[randomMove]);
  } else {
    $('.passBtn2').click();
  }
}

function handleMove(startingPosArr) {
    var piecesFlipped = null;
    var validDirections = [];
    var moveCount = 0;
    game.passButtClick=0;


    if (game.gameboard[startingPosArr[0]][startingPosArr[1]] === 'e' || game.gameboard[startingPosArr[0]][startingPosArr[1]] === 'l') {
        game.clickable = false;
        for (item in game.directions) {
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
            checkForLegalMoves();
            updateDisplay();
            if (game.mode === 'ai' && game.currentPlayer === 'w'){
              var timer = setTimeout(function(){
                game.clickable = false;
                var randTime = Math.floor(Math.random() * 1500) + 1000;
                aiMove();
                game.clickable = true;
                clearTimeout(timer);
              }, 1800);

            } else {
              game.clickable = true;
            }
            return true
        } else {
            game.clickable = true;
            return false;
        }

        function checkDirection(direction, startPoint) {//direction is a string (a valid key the obj)
            var currentPos = startPoint.slice();
            var newPos = [currentPos[0] + game.directions[direction][0], currentPos[1] + game.directions[direction][1]];
            if (newPos[0] < 8 && newPos[1] < 8 && newPos[0] >= 0 && newPos[1] >= 0){
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
            var newPos = [currentPos[0] + game.directions[direction][0], currentPos[1] + game.directions[direction][1]];
            if (game.gameboard[newPos[0]][newPos[1]] === game.getOpponentName()) {
                game.gameboard[newPos[0]][newPos[1]] = game.currentPlayer;
                piecesFlipped++;
                flipPieces(direction, newPos);

            }
        }
    }

}

function passBtn() {
    console.log('ha');
        if (game.currentPlayer === 'w') {
            game.currentPlayer = 'b';
        } else {
            game.currentPlayer = 'w';
        }


    // checkSameRound();
    updateDisplay();
    game.turn--;
}


function checkSameRound() {
    console.log("Current pass Button CLick" + game.passButtClick);

    if(game.passButtClick === 0){
        passBtn();
        game.passButtClick++;
        game.playerOneScore = game.score.b;
        game.playerTwoScore = game.score.w;


    }else if(game.passButtClick === 1){
        game.newPlayerOneScore = game.score.b;
        game.newPlayerTwoScore = game.score.w;

        // if(game.currentPlayer === 'w'){
        //     newPlayerTwoScore = game.score.w;
        // }else{
        //     newPlayerTwoScore = game.score.b;
        // }
        if(game.newPlayerOneScore === game.playerOneScore && game.newPlayerTwoScore === game.playerTwoScore){
            checkWinState();
            game.passButtClick=0;
            console.log("someone might win");
        }
    }

    console.log(game.passButtClick);
    // console.log('this is player one score' +game.playerOneScore);
    // console.log('this is player two score'+ game.playerTwoScore);
    // console.log('this is new player one score' +game.newPlayerOneScore);
    // console.log('this is new player two score'+ game.newPlayerTwoScore);

}






// function checkIfMoveIsLegal(arr) {
//     var rowPosition = arr[0];
//     var colPosition = arr[1];
//     // var currentTurn =  game.currentPlayer;
//     var lastTurn = game.getOpponentName();
//     if (game.gameboard[rowPosition][colPosition] === 'e') {
//         if (arr[rowPosition - 1, colPosition - 1] === lastTurn || arr[rowPosition - 1, colPosition] === lastTurn || arr[rowPosition - 1, colPosition + 1] === lastTurn || arr[rowPosition, colPosition - 1] === lastTurn || arr[rowPosition, colPosition + 1] === lastTurn || arr[rowPosition + 1, colPosition - 1] === lastTurn || arr[rowPosition +1, colPosition] === lastTurn || arr[rowPosition+1, colPosition + 1] === lastTurn ){
//         }
//
//         //on click, checks to see if the move is valid
