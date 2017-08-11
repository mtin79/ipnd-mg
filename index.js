// Extend Array Class with method to shuffle cards.
// https://www.kirupa.com/html5/shuffling_array_js.htm
Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

// This object represents the memory game to be played.
var game = {
  gameStarted: false,
  gameStartDate: undefined,
  gameEndDate: undefined,
  gameDurationInSeconds: undefined,
  moves: 0,
  gameplayStarRating: 3,
  cardPairsFound: 0,
  drawStepCards: [undefined, undefined],
  starRatingThresholds: [64,32,16],
  availableStepsPerDraw: 1,
  gridOfCards: [
    "a", "a", "b", "b",
    "c", "c", "d", "d",
    "e", "e", "f", "f",
    "g", "g", "h", "h"
  ],
  startGame: function(gameStartedFlag){
    if (game.gameStarted === false) {
      game.gameStarted = true;
      game.gameStartDate = Date();

      console.log("Game started: "+game.gameStarted+" ,"+game.gameStartDate);
    }
  },
  endGame: function(gameStartedFlag){
    if (game.gameStarted === true) {
      game.gameStarted = false;
      game.gameEndDate = Date();
      var gameDurationInSeconds = (endTime - startTime)/1000;

      $('[data-card-position]').removeClass("found");
      $('[data-card-position]').css("background-image", pictureUrlOfCard);

      console.log("Game Ended: "+game.EndDate+" ,"+gameDurationInSeconds);

      return gameDurationInSeconds;
    }
  },
  picturesForCards: {
    a:"url('./media/board-game.jpg')",
    b:"url('./media/cake.jpg')",
    c:"url('./media/cardiff-castle.jpg')",
    d:"url('./media/girls.jpg')",
    e:"url('./media/globe.jpg')",
    f:"url('./media/motorbike.jpg')",
    g:"url('./media/pebbles.jpg')",
    h:"url('./media/seagull.jpg')"
  },
  defaultCardPicture: "url('./media/contemporary_china.png')",

  initialize: function(){
    gameStarted = false;
    gameStartDate = undefined;
    gameEndDate = undefined;
    gameDurationInSeconds = undefined;
    moves = 0;
    gameplayStarRating = 3;
    cardPairsFound = 0;
    drawStepCards = [undefined, undefined];
    this.gridOfCards.shuffle();
    console.log("gridOfCards: "+this.gridOfCards);
  }
}

// Initialize the game.
game.initialize();

// A function to execute when the DOM is fully loaded.
$(function() {
  $('[data-action="reset-game"]').click(function(){
    game.endGame();

  });

  $('[data-card-position]:not(.found)').click(function(){
    var selectedCard = $(this);
    var pictureUrlOfCard = game.picturesForCards[game.gridOfCards[selectedCard.data("cardPosition")]];
    selectedCard.css("background-image", pictureUrlOfCard);

    game.startGame(gameStarted);
    game.drawStepCards[game.availableStepsPerDraw-1] = $(this).data("cardPosition");

    console.log("game.drawStepCards :"+game.drawStepCards);
    console.log("availableStepsPerDraw:"+game.availableStepsPerDraw);
    switch (game.availableStepsPerDraw) {
      case 1:
        game.availableStepsPerDraw += 1;
        game.moves += 1;
        break;
      case 2:
        if (game.gridOfCards[game.drawStepCards[0]] !== game.gridOfCards[game.drawStepCards[1]]) {
          $('[data-card-position="'+game.drawStepCards[0]+'"], [data-card-position="'+game.drawStepCards[1]+'"]').addClass("memoryCard--mismatch");
          var timeoutID = window.setTimeout(function(){
            $('[data-card-position="'+game.drawStepCards[0]+'"], [data-card-position="'+game.drawStepCards[1]+'"]').removeClass("memoryCard--mismatch").css("background-image", game.defaultCardPicture );
          },
          2000);
        } else {
          game.cardPairsFound += 1;
          $('[data-card-position="' + game.drawStepCards[0] + '"], [data-card-position="' + game.drawStepCards[1] + '"]').addClass("found");
        }
        game.availableStepsPerDraw = 1;
        break;
    }

    if (game.cardPairsFound === 8) {
      alert("You won!");
    }

  });

});
