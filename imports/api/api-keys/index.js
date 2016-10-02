Meteor.publish('APIKeys', function() {
  var userId = this.userId;
  var userApiKey = APIKeys.find({'owner': userId});

  if (userApiKey) {
    return userApiKey;
  }
  else {
    Meteor.call('initializeAPIKey', userId);
    var userApiKey = APIKeys.find({'owner': userId});
    return userApiKey;
  }

  return this.ready();
});

Meteor.methods({
  initializeAPIKey: function(userId) {
    check(userId, Match.OneOf(Meteor.userId(), String));

    var regeneratedAPIKey = Random.hexString(32);

    try {
      var key = APIKeys.insert({
        'owner': userId,
        'key': regeneratedAPIKey
      });
      return key;
    }
    catch(exception) {
      return exception;
    }
  },
  regenerateAPIKey: function(userId) {
    check(userId, Meteor.userId());

    var regeneratedAPIKey = Random.hexString(32);

    try {
      var key = APIKeys.update(
        {'owner': userId},
        {$set: {'key': regeneratedAPIKey}}
      )
      return key;
    }
    catch(exception) {
      return exception;
    }
  }
});
