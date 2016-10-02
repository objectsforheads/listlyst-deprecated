import './controlCenter.html';

import '../components/userAPIKeyMain.js';

Template.controlCenter.onRendered(function(){
  $('.userSignup').validate({
    rules: {
      signupEmailAddress: {
        required: true,
        email: true
      },
      signupUsername: {
        required: true
      },
      signupPassword: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      emailAddress: {
        required: "Please enter your email address to sign up.",
        email: "Please enter a valid email address."
      },
      username: {
        required: "Please enter a username to sign up"
      },
      password: {
        required: "Please enter a password to sign up.",
        minlength: "Please use at least six characters."
      }
    }
  });
});

Template.controlCenter.events({
  'submit .userSignup'(e) {
    e.preventDefault();
    // Grab the user's details.
    var user = {
      email: $('[name="signupEmailAddress"]').val(),
      password: $('[name="signupPassword"]').val(),
      username: $('[name="signupUsername"]').val()
    };

    // Create the user's account.
    Accounts.createUser({email: user.email, password: user.password, username: user.username}, function( error ){
      if(error){
        Bert.alert(error.reason, 'danger');
      } else {
        var userId = Meteor.userId();
        Bert.alert('Welcome!', 'success');
        Meteor.call( "initializeAPIKey", userId );
      }
    });
  },
  'submit .userLogin'(e) {
    e.preventDefault();

    let user = $('[name=loginUser]').val();
    let password = $('[name=loginPassword]').val();

    Meteor.loginWithPassword(user, password, function(error, result) {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
      else {
        Bert.alert('Welcome!', 'success');
      }
    });
  },
  'click .toggleAccountAccess': function() {
    $('.user-signup-container').toggle();
    $('.user-login-container').toggle().removeClass('hidden');
  }
});
