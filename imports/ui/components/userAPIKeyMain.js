import './userAPIKeyMain.html';

Template.userAPIKeyMain.onCreated(function() {
  Meteor.subscribe('APIKeys');
});

Template.userAPIKeyMain.onRendered(function() {
  var apiCopy = new Clipboard('.clipboardJS-trigger');
  apiCopy.on('success', function() {
    Bert.alert('API key copied!', 'success');
  })
  apiCopy.on('error', function() {
    Bert.alert('Could not copy API key! Ctrl+C to continue.');
  })
})

Template.userAPIKeyMain.helpers({
  userKey: function() {
    var apiKey = APIKeys.findOne();

    if ( apiKey ) {
      return apiKey.key;
    }
  }
});

Template.userAPIKeyMain.events({
  'click .regenerate-key': function() {
     var userId = Meteor.userId(),
         confirmRegeneration = confirm( "Are you sure? This will invalidate your current key!" );

     if ( confirmRegeneration ) {
       Meteor.call( "regenerateAPIKey", userId, function( error, response ) {
         if ( error ) {
           Bert.alert( error.reason, "danger" );
         } else {
           Bert.alert( "All done! Enjoy your new key!", "success" );
         }
       });
     }
  }
});
