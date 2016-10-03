Meteor.methods({
  filterCards: function(filters) {
    check(filters, Object);
    filteredCards = Cards.find(filters, {fields: {'_id':0}}).fetch();
    return filteredCards;
  }
});
