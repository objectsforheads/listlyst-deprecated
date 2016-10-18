import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route( '/', {
  name: 'controlCenter',
  action: function() {
    BlazeLayout.render( 'mainLayout', { main: 'controlCenter' } );
  }
});

FlowRouter.route( '/documentation', {
  name: 'documentation',
  action: function() {
    BlazeLayout.render( 'mainLayout', { main: 'documentation' } );
  }
});
