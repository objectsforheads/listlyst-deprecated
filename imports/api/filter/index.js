Meteor.methods({
  filterCards: function(filters) {
    check(filters, Object);
    filteredCards = CardsCurrent.find(filters, {fields: {_id: 0}}).fetch();
    return filteredCards;
  }
});
