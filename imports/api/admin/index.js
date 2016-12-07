Meteor.publish('ServerInfo', function() {
  return ServerInfo.find();
})

Meteor.methods({
  'changePatch': function(info) {
    check(info, {
      patchVersion: Number,
      patchJSON: Array,
      changePatchHandshake: String
    });

    if (info.changePatchHandshake !== 'TcgEZk8zbcns3Z3ebp4W') {
      throw new Meteor.Error(403, "Handshake rejected")
    }

    // Handshake good - start updating/adding cards

    // Keep a log while we do so
    var log = [];

    var cards = info.patchJSON;
    var patch = info.patchVersion;

    cards.forEach(function(card) {
      newCard = card;

      // If the card doesn't exist in the database yet, add it.
      if ( CardsCurrent.find({ 'id': card.id }, { limit: 1 }).count() === 0 ) {
        newCard.created = patch;
        newCard.lastModifed = patch;

        CardsCurrent.insert(newCard);

        log.push('Added current card: ' + card.name);
      }
      // Otherwise, update the entry in the current set,
      else {
        var currentCard = CardsCurrent.findOne({ 'id': card.id });
        var dbId = currentCard._id;

        if (currentCard.lastModifed < patch) {
          newCard.lastModifed = patch;
        }

        CardsCurrent.update({ _id: dbId }, newCard);

        log.push('Updated current card: ' + card.name);
      }

      // Then update the historical data
      newCard.patch = patch;

      if (CardsHistorical.find({ 'id': card.id, 'patch': patch }, { limit: 1 }).count() !== 0 ) {
        var currentCard = CardsHistorical.find({ 'id': card.id, 'patch': patch })
        var dbId = currentCard._id;

        CardsHistorical.update({_id: dbId}, newCard);

        log.push('Added historical card: ' + card.name);
      } else {
        // Or add a copy if it doesn't exist already
        CardsHistorical.insert(newCard);

        log.push('Updated historical card: ' + card.name);
      }
    });

    // Update the server meta if necessary
    var server = ServerInfo.findOne();

    // Check if patch exists
    if (server.patches.indexOf(patch) === -1) {
      // Add it if it doesn't
      server.patches.push(patch);
      // Sort it properly
      server.patches.sort(function(a,b) {
        return a - b;
      });

      log.push("Added patch " + patch);

      // Check if we're updating the earliest or latest
      if (server.earliest > patch || server.earliest === 0) {
        server.earliest = patch;
        log.push("Earliest server patch now at " + patch)
      }
      if (server.latest < patch || server.latest === 0) {
        server.latest = patch;
        log.push("Latest server patch now at " + patch)
      }
      log.push('Server now has patch information for patches: ' + server.patches);
      ServerInfo.update({_id: server._id}, server);
    }

    return log;
  },
  'removePatch': function(info) {
    check(info, {
      removePatch: Number,
      removePatchHandshake: String
    });

    // Confirm handshake
    if (info.removePatchHandshake !== 'h8w21B9MLhXNiazb2CpS') {
      throw new Meteor.Error(403, "Handshake rejected")
    }

    var patch = info.removePatch;
    // Pull the server meta
    var server = ServerInfo.findOne();

    // Log everything we do
    var log = [];
    log.push('Server has patch information for patches: ' + server.patches);


    // Check if the patch exists
    if (server.patches.indexOf(info.removePatch) === -1) {
      throw new Meteor.Error(404, "Patch not found")
    }

    // Check if earliest or latest
    if (patch === server.earliest) {
      server.earliest = server.patches[server.patches.indexOf(patch) + 1] || 0;
      log.push('Earliest patch recorded changed from ' + patch + ' to ' + server.earliest);
    }
    if (patch === server.latest) {
      server.latest = server.patches[server.patches.indexOf(patch) - 1] || 0;
      log.push('Latest patch recorded changed from ' + patch + ' to ' + server.latest);
    }

    // Remove patch from server meta
    server.patches.splice(server.patches.indexOf(patch), 1);
    log.push('Removed patch ' + patch);

    ServerInfo.update({_id: server._id}, server)
    log.push('Server now has patch information for patches: ' + server.patches);

    // TEMP reset
    // server.earliest = 0.62;
    // server.latest = 1.76;
    // server.patches = [0.62,1.71,1.72,1.76];



    // Clear cards
    CardsCurrent.remove({});
    CardsHistorical.remove({patch: patch});

    // Re-create cardsCurrent
    CardsHistorical.find().fetch().forEach(function(card) {
      delete card._id;

      patch = JSON.parse(JSON.stringify(card)).patch;
      delete card.patch;

      if ( CardsCurrent.find({ 'id': card.id }, { limit: 1 }).count() === 0 ) {
        card.created = patch;
        card.lastModifed = patch;
        CardsCurrent.insert(newCard);
      }
      // Otherwise, update the entry in the current set,
      else {
        var currentCard = CardsCurrent.findOne({ 'id': card.id });
        var dbId = currentCard._id;

        if (currentCard.lastModifed < patch) {
          currentCard.lastModifed = patch;
        }

        CardsCurrent.update({ _id: dbId }, card);
      }
    })

    return log;
  },
  'nuclearWinter': function(info) {
    check(info, {
      doomsdayHandshake: String
    })

    if (info.doomsdayHandshake !== 'kbKdQgrGwRQqIkSeBizT') {
      throw new Meteor.Error(403, "Handshake rejected")
    }

    var log = [];

    CardsCurrent.remove({});
    log.push('Removed all latest cards');
    CardsHistorical.remove({});
    log.push('Removed all historical card data');
    ServerInfo.remove({});
    log.push('Reset server meta data');

    ServerInfo.insert({
      patches: [],
      earliest: 0,
      latest: 0
    })

    return log;
  }
});
