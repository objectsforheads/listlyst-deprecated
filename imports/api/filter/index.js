Meteor.methods({
  filterCards: function(filters) {
    check(filters, Object);
    filteredCards = CardsCurrent.find(filters).fetch();
    return filteredCards;
  }
});
