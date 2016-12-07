import './admin.html';

Template.admin.events({
  'submit .changePatch': function(e) {
    e.preventDefault();
    Bert.alert('Updating patch...');

    var self = Template.instance();
    var info = $(e.currentTarget).serializeArray();
    info = info.reduce(function(a, b) {
      a[b.name] = b.value;

      return a;
    }, {})
    info.patchVersion = Number(info.patchVersion);
    info.patchJSON = JSON.parse(info.patchJSON);

    Meteor.call('changePatch', info, function(err, data) {
      if (err) {
        Bert.alert(err.reason, 'danger');
      } else {
        Bert.alert('Successfully updated patch!', 'success');
        self.changelog.set(data);
      }
    });
  },
  'submit .removePatch': function(e) {
    e.preventDefault();
    Bert.alert('Removing patch...');

    var self = Template.instance();
    var info = $(e.currentTarget).serializeArray();
    info = info.reduce(function(a, b) {
      a[b.name] = b.value;

      return a;
    }, {})
    info.removePatch = Number(info.removePatch);

    Meteor.call('removePatch', info, function(err, data) {
      if (err) {
        Bert.alert(err.reason, 'danger');
      } else {
        Bert.alert('Successfully removed patch!', 'success');
        self.changelog.set(data);
      }
    })
  },
  'submit .updateServerInfo': function(e) {
    e.preventDefault();
  },
  'submit .engageDoomsday': function(e) {
    e.preventDefault();
    Bert.alert('Blowing everything up...');

    var self = Template.instance();
    var info = $(e.currentTarget).serializeArray();
    info = info.reduce(function(a, b) {
      a[b.name] = b.value;

      return a;
    }, {})
    Meteor.call('nuclearWinter', info, function(err, data) {
      if (err) {
        Bert.alert(err.reason, 'danger');
      } else {
        Bert.alert('Congrats on destroying the world', 'success');
        self.changelog.set(data);
      }
    });
  }
})

Template.admin.onCreated(function() {
  this.subscribe('ServerInfo');
  this.changelog = new ReactiveVar(null);
})

Template.admin.helpers({
  'changelog': function() {
    return Template.instance().changelog.get();
  },
  'serverMeta': function() {
    var server = ServerInfo.findOne();
    var serverMeta = []
    for (var meta in server) {
      if (meta !== '_id') {
        serverMeta.push(meta + ':' + server[meta]);
      }
    }
    return serverMeta;
  },
  'serverMetaKey': function() {
    return this.split(':')[0];
  },
  'serverMetaValue': function() {
    return this.split(':')[1]
  }
})
