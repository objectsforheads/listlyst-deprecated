import '../../ui/css/normalize.css';
import '../../ui/css/typebase.css';
import '../../ui/css/site.scss';
import '../../ui/css/typography.scss';
import '../../ui/css/demo.scss';

import '../../ui/components/userLogout.js';

import './main.html';

Template.mainLayout.onCreated(function() {
  this.subscribe('ServerInfo');
})

Template.mainLayout.onRendered(function() {
  document.title = "Listlyst - a RESTful API for Duelyst cards";
})

Template.mainLayout.helpers({
  'earliestPatch': function() {
    return ServerInfo.findOne().earliest;
  },
  'latestPatch': function() {
    return ServerInfo.findOne().latest;
  },
  'lastUpdated': function() {
    return ServerInfo.findOne().updated;
  }
})
