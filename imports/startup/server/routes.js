Picker.route('/api/v1/cards', function(parameters, request, response, next) {
  // Allow everyone to access the API
  response.setHeader( 'Access-Control-Allow-Origin', '*' );

  response.end( JSON.stringify(API.relay( parameters, 'filter' )) );
})
