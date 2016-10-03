// Allow Google Fonts
BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');

// Allow CDNs
BrowserPolicy.content.allowOriginForAll('cdnjs.cloudflare.com');

import './routes.js';

// User's API Key functionality
import '../../api/api-keys';

// Seed the API database
import '../../api/collections/seed.js';
