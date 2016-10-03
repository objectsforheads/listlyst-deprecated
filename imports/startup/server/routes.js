Picker.route('/api/v1/cards/:query1?/:parameter1?/:query2?/:parameter2?/:query3?/:parameter3?/:query4?/:parameter4?/:query5?/:parameter5?', function(parameters, request, response, next) {

  // Prep the filters object for collection of key:value pairs.
  var filters = {};
  for (var query in parameters) {
    // HACK Not sure why an extra object is being inserted into the filters object;
    //      add the typeof check to stop it from being recognized as valid.
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

      // Add them to the filter object.
      filters[key] = value;
    }
  }

  var result = Meteor.call('filterCards', filters)

  response.end( JSON.stringify(result) );

})
