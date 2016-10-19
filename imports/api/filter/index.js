Meteor.methods({
  filterLatest: function(filters) {
    check(filters, Object);
    filteredCards = CardsCurrent.find(filters, {fields: {_id: 0}}).fetch();
    return filteredCards;
  },
  filterHistorical: function(filters) {
    check (filters, Object);
    if (filters.snapshot === 'true') {
      filters.parsedFilters.patch = {$lte: Number(filters.patch)};
      filteredCards = CardsHistorical.find(filters.parsedFilters, {fields: {_id: 0}}).fetch();

      // We need to filter for the most recent version of the card
      // We'll set up a filter to check which ones we've already included in our list
      cardIds = []
      // We'll also set up a new container for the most recent cards
      cardsMostRecent = []
      filteredCards.forEach(function(card) {
        // Check to see if we've already added this card.
        var cardIndex = cardIds.indexOf(card.id);

        // If no version of the card has been added, push it to most recent and note it.
        if ( cardIndex === -1 ) {
          cardIds.push(card.id);
          cardsMostRecent.push(card);
        }
        // If the id's already in, we'll compare the two cards and pick out the later one.
        else {
          var currentCard = cardsMostRecent[cardIndex];

          if (card.patch > currentCard.patch) {
            cardsMostRecent.splice(cardIndex, 1);
            cardsMostRecent.push(card);
          }
        }
      })
      var result = {
        patch: filters.patch,
        cards: cardsMostRecent
      }
      return result
    }
    else {
      filters.parsedFilters.patch = Number(filters.patch);
      filteredCards = CardsHistorical.find(filters.parsedFilters, {fields: {_id: 0}}).fetch();
      var result = {
        patch: filters.patch,
        cards: filteredCards
      }
      return result
    }
  },
  cardHistorical: function(cardId) {
    check (cardId, Object);
    cardHistory = CardsHistorical.find(filters, {fields: {_id: 0}}).fetch();
    return cardHistory;
  }
});
