Picker.route('/api/v1/cards', function(parameters, request, response, next) {
  // Allow everyone to access the API
  // Only allow GET requests
  // Return JSON
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET' );
  response.setHeader( 'Content-Type', 'application/json' );

  response.end( API.relay( parameters, 'filterLatest', response ) );
})

Picker.route('/api/v1/patch/:patch/cards', function(parameters, request, response, next) {
  // Allow everyone to access the API
  // Only allow GET requests
  // Return JSON
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET' );
  response.setHeader( 'Content-Type', 'application/json' );

  response.end( API.relay( parameters, 'filterHistorical', response ) );
})

Picker.route('/api/v1/card/:id', function(parameters, request, response, next) {
  // Allow everyone to access the API
  // Only allow GET requests
  // Return JSON
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET' );
  response.setHeader( 'Content-Type', 'application/json' );

  response.end( API.relay( parameters, 'cardHistorical', response ) );
})
