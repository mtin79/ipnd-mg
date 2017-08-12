// Extend Array Class with method to shuffle cards.
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
  cardPairComparison: false,
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
  startGame: function(){
    if (game.gameStarted === false) {
      game.gameStarted = true;
      game.gameStartDate = Date.now();

      console.log("Game started: "+game.gameStarted+" ,"+game.gameStartDate);
    }
  },
  endGame: function(){
    if (game.gameStarted === true) {
      game.gameStarted = false;
      game.gameEndDate = Date.now();
      game.gameDurationInSeconds = (game.gameEndDate - game.gameStartDate) / 1000;

      $('[data-card-position]').removeClass("found");
      $('[data-card-position]').removeClass("memoryCard--mismatch");
      $('[data-card-position]').css("background-image", game.defaultCardPicture);

      console.log("Game Ended: "+game.EndDate+" ,"+game.gameDurationInSeconds);
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
    game.gameStarted = false;
    game.gameStartDate = undefined;
    game.gameEndDate = undefined;
    game.gameDurationInSeconds = undefined;
    game.moves = 0;
    game.gameplayStarRating = 3;
    game.cardPairsFound = 0;
    game.drawStepCards = [undefined, undefined];
    game.gridOfCards.shuffle();
    console.log("gridOfCards: "+this.gridOfCards);
  }
}

// Initialize the game.
game.initialize();

// A function to execute when the DOM is fully loaded.
$(function() {
  $('[data-action="reset-game"]').click(function(){
    game.endGame();
    $('#wonModal').modal('hide');
    game.startGame();

  });

  $('[data-card-position]:not(.found)').click(function(){
    // If two cards have been selected and compared, prevent other cards to be selected.
    if (game.cardPairComparison === true) {
      $(this).hide('fast').show('fast');
      return;
    }

    // Test if game just got started to initialize gameplay variables.
    game.startGame();

    var selectedCard = $(this);
    var pictureUrlOfCard = game.picturesForCards[game.gridOfCards[selectedCard.data("cardPosition")-1]];
    
    selectedCard.css("background-image", pictureUrlOfCard);
    game.drawStepCards[game.availableStepsPerDraw-1] = $(this).data("cardPosition");

    console.log("game.drawStepCards :"+game.drawStepCards);
    console.log("availableStepsPerDraw:"+game.availableStepsPerDraw);

    switch (game.availableStepsPerDraw) {
      case 1:
        game.availableStepsPerDraw += 1;
        game.moves += 1;
        break;
      case 2:
        game.cardPairComparison = true;
        if (game.gridOfCards[game.drawStepCards[0]-1] !== game.gridOfCards[game.drawStepCards[1]-1]) {
          $('[data-card-position="'+game.drawStepCards[0]+'"], [data-card-position="'+game.drawStepCards[1]+'"]').addClass("memoryCard--mismatch");
          var timeoutID = window.setTimeout(function(){
            $('[data-card-position="'+game.drawStepCards[0]+'"], [data-card-position="'+game.drawStepCards[1]+'"]').removeClass("memoryCard--mismatch").css("background-image", game.defaultCardPicture );
            game.cardPairComparison = false;
          },
          2000);
        } else {
          game.cardPairsFound += 1;
          $('[data-card-position="' + game.drawStepCards[0] + '"], [data-card-position="' + game.drawStepCards[1] + '"]').addClass("found");
          game.cardPairComparison = false;
        }
        game.availableStepsPerDraw = 1;
        break;
    }

    if (game.cardPairsFound === 8) {
      var timeoutID = window.setTimeout(function () {
        game.endGame();
        // game.showDuration();
        // game.showMoves();
        // game.showStartRating(game.moves);
        $('#wonModal').modal('show');
        $("#wonModal .gameDuration").text("Duration: " + parseInt(game.gameDurationInSeconds / 60) + " minutes," + parseInt(game.gameDurationInSeconds % 60) + " seconds");
      },1000);
    }

  });

});
