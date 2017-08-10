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
  gridOfCards: [
    "a", "a", "b", "b",
    "c", "c", "d", "d",
    "e", "e", "f", "f",
    "g", "g", "h", "h"
  ],
  picturesForCards: [
    "url('http://lorempixel.com/200/200/business/1')",
    "url('http://lorempixel.com/200/200/cats/1')",
    "url('http://lorempixel.com/200/200/city/1')",
    "url('http://lorempixel.com/200/200/food/1')",
    "url('http://lorempixel.com/200/200/animals/1')",
    "url('http://lorempixel.com/200/200/nature/1')",
    "url('http://lorempixel.com/200/200/abstract/1')",
    "url('http://lorempixel.com/200/200/animals/1')"
  ],

  initialize: function(){
    this.gridOfCards.shuffle();
    console.log("gridOfCards: "+this.gridOfCards);
  }
}

var availableStepsPerDraw = 2;

// Initialize the game.
game.initialize();

// A function to execute when the DOM is fully loaded.
$(function() {
  $('[data-card-position]').click(function(){
    var selectedCard = $(this);
    var pictureUrlOfCard = game.picturesForCards[selectedCard.data("cardPosition")];
    selectedCard.css("background-image", pictureUrlOfCard);
  });
});
