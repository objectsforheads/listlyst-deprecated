import './demo.html';

Template.registerHelper('demo_arrayifyPatchwork',function(obj){
    var result = [];
    for (var key in obj) result.push({patch: key, card:obj[key]});
    return result;
});

Template.demo.onCreated(function() {
  var patches = [0.62, 1.63, 1.64, 1.65, 1.66, 1.67, 1.69, 1.71]

  Meteor.call('demoAPIAccess', patches, function(error, data) {
    if (error) {
      return console.log(error);
    }
    else {
      // Got all the cards from the API and concatenated the results.
      var allCards = data;

      // Now we need to sort them into an array to pass to our template,
      // who we'll leave responsible for getting this data to the DOM.

      // To do that, we'll need to keep track of our cards.
      var cardIds = [];
      // We'll also need a new container for the sorted cards.
      var sortedCards = [];

      allCards.forEach(function(card, index) {
        // We need 2 sets of data - canonical and per-patch
        // We'll use canonical for all of our filters later on
        // And per-patch for the diff feature

        var cardId = card.id;
        var patch = card.patch;
        delete card.id;
        delete card.patch;

        var cardIndex = cardIds.indexOf(cardId);

        if (cardIndex === -1) {
          cardIds.push(cardId);
          // Build the container for the card in sortedCards by cloning the card.
          var sortedCard = JSON.parse(JSON.stringify(card));
          sortedCard.id = cardId;
          sortedCard.patch = patch;
          // Then add the card to its new container.
          sortedCard.patches = {};
          sortedCard.patches[patch] = card;
          // And then the container to the array
          sortedCards.push(sortedCard);
        }
        else {
          // If the card's already been added once, use the index to find it
          // Having done that, add the patch info to the patches key
          sortedCards[cardIndex].patches[patch] = card;

          // If this info is more up to date than canonical, update canonical
          if (sortedCards[cardIndex].patch < patch) {
            for (var attr in card) {
              sortedCards[cardIndex].patch = patch;
              sortedCards[cardIndex][attr] = card[attr];
            }
          }
        }
      })
      return Session.set('patchwork', sortedCards);
    }
    return false;
  })
})
Template.demo.helpers({
  cards: function() {
    return Session.get('patchwork');
  },
  cardInfo: function() {
    var info = JSON.stringify(this.card);
    info = info.replace(/,/g, ',\n');
    return info;
  }
});
