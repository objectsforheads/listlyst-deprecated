import '../../ui/css/normalize.css';
import '../../ui/css/typebase.css';
import '../../ui/css/site.scss';
import '../../ui/css/typography.scss';
import '../../ui/css/demo.scss';

import '../../ui/components/userLogout.js';

import './main.html';

Template.mainLayout.onRendered(function() {
  document.title = "Listlyst - a RESTful API for Duelyst cards";
})
