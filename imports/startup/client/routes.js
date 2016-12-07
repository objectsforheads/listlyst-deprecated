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

FlowRouter.route( '/demo', {
  name: 'demo',
  action: function() {
    BlazeLayout.render( 'mainLayout', { main: 'demo' } )
  }
})

FlowRouter.route('/secret-passage', {
  name: 'admin',
  action: function() {
    BlazeLayout.render( 'mainLayout', { main: 'admin' } )
  }
})
