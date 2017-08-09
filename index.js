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

  initialize: function(){
    console.log("gridOfCards: "+this.gridOfCards);
    this.gridOfCards.shuffle();
    console.log("gridOfCards - shuffled: "+this.gridOfCards);
  }
}

game.initialize();
