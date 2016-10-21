var Future = Npm.require("fibers/future");

Meteor.methods({
  demoAPIAccess: function(patches) {
    check(patches, Array);

    var allCards = [];

    var futures = patches.map(function(patch) {
      var future = new Future();
      var apiURL = 'http://listlyst.com/api/v1/patch/' + patch + '/cards?apikey=157b829645ea32f7e584beab7d6c06a5';

      future.return(HTTP.get( apiURL, {} ))
      return future;
    })

    var results = futures.map(function(future) {
      var result = future.wait();
      if (result) {
        data = JSON.parse(result.content);
        allCards = allCards.concat(data.cards);
      }
      return result;
    })

    return allCards;
  }
});
