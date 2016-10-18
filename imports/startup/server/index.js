// Allow Google Fonts
BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');

// Allow CDNs
BrowserPolicy.content.allowOriginForAll('cdnjs.cloudflare.com');

import './routes.js';

// actual API
import '../../api/config/api.js';
// User's API Key functionality
import '../../api/api-keys';
// Filter for the API
import '../../api/filter';
