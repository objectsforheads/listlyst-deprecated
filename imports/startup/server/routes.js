Picker.route('/api/v1/cards/:query1?/:parameter1?/:query2?/:parameter2?/:query3?/:parameter3?/:query4?/:parameter4?/:query5?/:parameter5?', function(parameters, request, response, next) {
  // Allow everyone to access the API
  response.setHeader( 'Access-Control-Allow-Origin', '*' );

  response.end( JSON.stringify(API.relay( parameters, 'filter' )) );
})
