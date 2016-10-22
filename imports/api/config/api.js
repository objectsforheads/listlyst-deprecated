API = {
  // Take a user request and deliver the appropriate response back
  relay: function(parameters, operation, response) {
    // User has sent a request and is requesting a response back
    // Check with API.authenticator that the user has proper authorization for their request
    apikey = parameters.query.apikey;
    var authorized = API.support.authenticator(apikey);

    // If they're authorized,
    // go ahead and pass the request to API.operator and wait for a response
    // then inform the user of API.operator's response
    if (authorized) {
      // API no longer needs api key, remove it from parameters
      delete parameters.query.apikey;

      // pass parameters along to API.operator to fetch a response
      return API.operator[operation](response, parameters);
    }
    // If they're not authorized,
    // stop here and return a denied message to API.relay
    else {
      return API.support.responder(response, 401, { error: 401, message: "Invalid API key." });
    }
  },
  operator: {
    // API.relay requests a response to the passed along parameters
    filterLatest: function(response, parameters) {
      parsedFilters = API.support.parser(parameters);
      return API.support.responder(response, 200, Meteor.call('filterLatest', parsedFilters));
    },
    filterHistorical: function(response, parameters) {
      snapshot = parameters.query.snapshot;
      if (snapshot) {
        delete parameters.query.snapshot;
      }
      parsedFilters = API.support.parser(parameters);
      patch = parameters.patch;
      filters = {
        parsedFilters: parsedFilters,
        patch: patch,
        snapshot: snapshot
      }
      return API.support.responder(response, 200, Meteor.call('filterHistorical', filters));
    },
    cardHistorical: function(response, parameters) {
      cardId = Number(parameters.id);
      filters = {
        id: cardId
      }
      if (parameters.query.patch) {
        filters.patch = Number(parameters.query.patch)
      }
      return API.support.responder(response, 200, Meteor.call('cardHistorical', filters));
    }
  },
  support: {
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
    parser: function(parameters) {
      // Grab the query from the parameters object - it contains our filters
      var filters = parameters.query;

      for (var key in filters) {

        var value = filters[key].toLowerCase();

        // The values for the URL differ than the filters used in the database
        // therefore we need to adjust the user-input to match the server's keywords

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
            case 'vetruvian':
              value = "Vetruvian Imperium";
              break
            case 'neutral':
              value = 'Neutral';
              break
          }
        }

        // Battle pets exist
        else if (key === 'race') {
          switch(value) {
            case 'battlepet':
              value = 'Battle Pet';
              break;
            default:
              value = value.charAt(0).toUpperCase() + value.slice(1);
          }
        }

        // User inputs a set shorthand so we'll expand it here
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

        // Change the value before sending the request to the database
        filters[key] = value;

      }

      return filters
    },
    responder: function(request, statusCode, data) {
      request.statusCode = statusCode;
      request.end( JSON.stringify( data ) );
    }
  }
}
