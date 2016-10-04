API = {
  // Take a user request and deliver the appropriate response back
  relay: function(parameters, operation) {
    // User has sent a request and is requesting a response back
    // Check with API.authenticator that the user has proper authorization for their request
    apikey = parameters.query.apikey;
    var authorized = API.authenticator(apikey);

    // If they're authorized,
    // go ahead and pass the request to API.operator and wait for a response
    // then inform the user of API.operator's response
    if (authorized) {
      // API no longer needs api key, remove it from parameters
      delete parameters.query.apikey;

      // pass parameters along to API.operator to fetch a response
      return API.operator[operation](parameters);
    }
    // If they're not authorized,
    // stop here and return a denied message to API.relay
    else {
      return { error: 401, message: "Slow down there, friend! The clerical bots say your API key is invalid. They don't know why it's invalid, but their human managers suggest checking if the API key's been mistyped or scrubbed. If the problem persists, contact support to talk to a live human being for help." };
    }
  },
  // Make sure the user is authorized to access the API
  authenticator: function(apikey) {
    var userCheck = APIKeys.findOne({'key': apikey}, {fields: {'owner': 1}});
    if (userCheck) {
      return true;
    }
    else {
      return false;
    }
  },
  operator: {
    // API.relay requests a response to the passed along parameters
    filter: function(parameters) {
      // Prep the filters object for collection of key:value pairs.
      var filters = {};

      for (var query in parameters) {
        // Disclude any key-value pair that:
        // 1. is a parameter, not a query
        // 2. is empty
        // 3. is the actual query-parameter portion of the request
        if (query.includes('query') && parameters[query] != null && typeof parameters[query] === 'string') {
          // Pull the key:value pairs from the URL.
          key = parameters[query].toLowerCase();
          value = parameters['parameter' + query.replace('query', '')].toLowerCase();

          // The values for the URL differ than the filters used in the database
          // therefore we need to adjust the user-input to the server's keywords

          // User inputs faction as one word but faction is officially 2 words
          if (key === 'faction') {
            switch(value) {
              case 'lyonar':
                value = 'Lyonar Kingdoms';
                break
              case 'songhai':
                value = 'Songhai Empire';
                break
              case 'abyssian':
                value = 'Abyssian Host';
                break
              case 'magmar':
                value = 'Magmar Aspects';
                break
              case 'vanar':
                value = 'Vanar Kindred';
                break
              case 'neutral':
                value = 'Neutral';
                break
            }
          }

          // user inputs a set shorthand so we'll expand it here
          else if (key === 'set') {
            switch(value) {
              case 'base':
                value = 'Base';
                break
              case 'dos':
                value = 'Denizens of Shim\'Zar'
                break
            }
          }

          else {
            // By default, capitalize the value
            value = value.charAt(0).toUpperCase() + value.slice(1);
          }

          // Add the key-value pair to the filter object.
          filters[key] = value;
        }
      }

      return Meteor.call('filterCards', filters);
    }
  }
}
