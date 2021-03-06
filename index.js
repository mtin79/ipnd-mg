// Extend Array Class with method to shuffle cards.
Array.prototype.shuffle = function() {
  var input = this;

  for (var i = input.length - 1; i >= 0; i--) {

    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];

    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}

// This object represents the memory game to be played.
// It contains state and behavior of it.
var game = {
  gameStarted: false,
  gameStartDate: null,
  gameEndDate: null,
  gameDurationInSeconds: null,
  moves: 0,
  cardPairComparison: false,
  gameplayStarRating: 3,
  cardPairsFound: 0,
  drawStepCards: [null, null],
  starRatingThresholds: [64, 32, 16],
  availableStepsPerDraw: 1,
  timer: null,
  time: 0,
  gridOfCards: [
    "a", "a", "b", "b",
    "c", "c", "d", "d",
    "e", "e", "f", "f",
    "g", "g", "h", "h"
  ],
  startGame: function() {
    if (game.gameStarted === false) {
      game.gameStarted = true;
      game.gameStartDate = Date.now();
      $(".controls__timer").text(0);
      game.startTimer();

      console.log("Game started: " + game.gameStarted + " ," + game.gameStartDate);
    }
  },
  endGame: function() {
    if (game.gameStarted === true) {
      game.gameStarted = false;
      game.gameEndDate = Date.now();
      game.gameDurationInSeconds = (game.gameEndDate - game.gameStartDate) / 1000;
      game.endTimer();
    }
  },
  startTimer: function(){
    game.timer = setInterval(function(){
      $(".controls__timer").text(game.time += 1);
    }, 1000);
  },
  endTimer: function(){
    clearInterval(game.timer);
  },
  picturesForCards: {
    a: "url('./media/board-game.jpg')",
    b: "url('./media/cake.jpg')",
    c: "url('./media/cardiff-castle.jpg')",
    d: "url('./media/girls.jpg')",
    e: "url('./media/globe.jpg')",
    f: "url('./media/motorbike.jpg')",
    g: "url('./media/pebbles.jpg')",
    h: "url('./media/seagull.jpg')"
  },
  defaultCardPicture: "url('./media/contemporary_china.png')",
  initialize: function() {
    game.gameStarted = false;
    game.gameStartDate = null;
    game.gameEndDate = null;
    game.gameDurationInSeconds = null;
    game.availableStepsPerDraw = 1;
    game.moves = 0;
    game.gameplayStarRating = 3;
    game.cardPairsFound = 0;
    game.drawStepCards = [null, null];
    game.gridOfCards.shuffle();
    game.timer = null;
    game.time = 0;
    $(".controls span").text("");
    $('[data-card-position]').removeClass("found");
    $('[data-card-position]').removeClass("memory-card--mismatch");
    $('[data-card-position]').css("background-image", game.defaultCardPicture);
  },
  updateGameStats: function() {
    // update the moves counter showing the number of card pairs drawn.
    $(".controls__moves").text(parseInt(game.moves));

    // update the starRating according to the number of moves made.
    $(".controls__rating").text(function() {
      var starString = "";
      var starActiveString = '<i class="fa fa-star" aria-hidden="true"></i>';
      var starInactiveString = '<i class="fa fa-star-o" aria-hidden="true"></i>';
      if (game.moves > 0 && game.moves <= game.starRatingThresholds[2]) {
        starString = starActiveString + starActiveString + starActiveString;
      } else if (game.moves <= game.starRatingThresholds[1]) {
        starString = starActiveString + starActiveString + starInactiveString;
      } else {
        starString = starActiveString + starInactiveString + starInactiveString;
      };
      console.log($(this));

      $(this).html(starString);
    });
  },
  // The checkCurrentPairOfCards - method checks when two cards are revealed if
  // they are a match or not and saves the result back into the game stats.
  checkCurrentPairOfCards: function(){
    game.cardPairComparison = true;
    if (game.gridOfCards[game.drawStepCards[0] - 1] !== game.gridOfCards[game.drawStepCards[1] - 1]) {
      $('[data-card-position="' + game.drawStepCards[0] + '"], [data-card-position="' + game.drawStepCards[1] + '"]')
        .addClass("memory-card--mismatch");
      var timeoutID = window.setTimeout(function() {
        $('[data-card-position="' + game.drawStepCards[0] + '"], [data-card-position="' + game.drawStepCards[1] + '"]')
          .removeClass("memory-card--mismatch").removeClass("found").css("background-image", game.defaultCardPicture);
          game.cardPairComparison = false;
        },
        2000);
    } else {
      game.cardPairsFound += 1;
      $('[data-card-position="' + game.drawStepCards[0] + '"], [data-card-position="' + game.drawStepCards[1] + '"]').addClass("found");
      game.cardPairComparison = false;
    }
    game.moves += 1;
    game.availableStepsPerDraw = 1;
    game.updateGameStats();
  },
  // The checkIfAllPairsOfCardsFound - method checks if that game is finished
  // and all card pairs have been found. It will then display a modal window
  // with the gameplace results.
  checkIfAllPairsOfCardsFound: function(){
    if (game.cardPairsFound === 8) {
      game.endGame();
      $("#wonModal .gameDuration").text(
        "Duration: " + parseInt(game.gameDurationInSeconds / 60) +
         " minutes," + parseInt(game.gameDurationInSeconds % 60) +
         " seconds");
      $("#wonModal .moves").text("Moves: " + parseInt(game.moves));
      $("#wonModal .starRating").text(function() {
        var starString = "";
        var starActiveString = '<i class="fa fa-star" aria-hidden="true"></i>';
        var starInactiveString = '<i class="fa fa-star-o" aria-hidden="true"></i>';
        if (game.moves <= game.starRatingThresholds[2]) {
          starString = starActiveString + starActiveString + starActiveString;
        } else if (game.moves <= game.starRatingThresholds[1]) {
          starString = starActiveString + starActiveString + starInactiveString;
        } else {
          starString = starActiveString + starInactiveString + starInactiveString;
        };
        console.log($(this));

        $(this).html("Rating: " + starString);
      });

      window.setTimeout(function() {
        // game.showDuration();
        // game.showMoves();
        // game.showStartRating(game.moves);
        $('#wonModal').modal('show');
      }, 1000);
    }
  }
}

// Initialize the game.
game.initialize();

// A function to execute when the DOM is fully loaded.
$(function() {
  $('[data-action="reset-game"]').click(function() {
    game.endGame();
    game.initialize();
    $('#wonModal').modal('hide');
  });

  $(".game-Board").on("click", "[data-card-position]:not(.found)", function() {
    // If two cards have been selected and compared, prevent other cards to be selected.
    if (game.cardPairComparison === true) {
      $(this).hide('fast').show('fast');
      return;
    }

    $(this).addClass("found");

    // Test if game just got started to initialize gameplay variables.
    game.startGame();

    var selectedCard = $(this);
    var pictureUrlOfCard = game.picturesForCards[game.gridOfCards[selectedCard.data("cardPosition") - 1]];

    selectedCard.css("background-image", pictureUrlOfCard);
    game.drawStepCards[game.availableStepsPerDraw - 1] = $(this).data("cardPosition");

    switch (game.availableStepsPerDraw) {
      case 1:
        game.availableStepsPerDraw += 1;
        break;
      case 2:
        game.checkCurrentPairOfCards();
        break;
    }

    game.checkIfAllPairsOfCardsFound();
  });

});
