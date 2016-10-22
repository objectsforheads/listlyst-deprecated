// Allow Google Fonts
BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');

// Allow CDNs
BrowserPolicy.content.allowOriginForAll('cdnjs.cloudflare.com');

// Allow lazy sourcing of image assets
BrowserPolicy.content.allowOriginForAll('i67.tinypic.com');
BrowserPolicy.content.allowOriginForAll('i63.tinypic.com');

// Kadira monitoring
Kadira.connect('HxkXzqkqymTPHyC2s', '1deb4a59-00c6-4a21-a642-d736325b5571');

import './routes.js';

// Update patch data
// import '../../api/seed';

// actual API
import '../../api/config/api.js';
// User's API Key functionality
import '../../api/api-keys';
// Filter for the API
import '../../api/filter';

// Demo functionality
import '../../api/demo';
