import './documentation.html';

Template.documentation.onCreated(function() {
  Meteor.subscribe('APIKeys');

  this.allCardsQuery = new ReactiveVar(null);

  this.cardsByPatchPatch = new ReactiveVar('[:patch]');
  this.cardsByPatchQuery = new ReactiveVar(null);

  this.cardByIdId = new ReactiveVar('[:id]');
  this.cardByIdQuery = new ReactiveVar(null);
});

Template.documentation.onRendered(function() {
  var urlCopy = new Clipboard('.clipboardJS-trigger');

  urlCopy.on('success', function() {
    Bert.alert('Url copied!', 'success');
  })
  urlCopy.on('error', function() {
    Bert.alert('Could not copy URL! Ctrl+C to continue.');
  })
})

Template.documentation.helpers({
  'baseURL': function() {
    return 'http://listlyst.com/api/v1/'
  },
  'userAPIKey': function() {
    return APIKeys.findOne() ? APIKeys.findOne().key : "[yourKey]"
  },
  'allCards_queries': function() {
    return Template.instance().allCardsQuery.get();
  },
  'cardsByPatch_patch': function() {
    return Template.instance().cardsByPatchPatch.get();
  },
  'cardsByPatch_queries': function() {
    return Template.instance().cardsByPatchQuery.get();
  },
  'cardById_id': function() {
    return Template.instance().cardByIdId.get();
  },
  'cardById_queries': function() {
    return Template.instance().cardByIdQuery.get();
  }
})

Template.documentation.events({
  'change .allCards_query': function() {
    var queryString = [];
    $('.allCards_query').each(function() {
      var $query = $(this);

      if ($query.val().length !== 0) {
        var query = $query.attr('name').split('_')[1];
        var value = $query.val();
        queryString.push(query + '=' + value);
      }
    })

    queryString = queryString.join('&');
    if (queryString.length > 0) {
      queryString = queryString + '&';
    }

    Template.instance().allCardsQuery.set(queryString);
  },
  'change .cardsByPatch_patch': function(e) {
    Template.instance().cardsByPatchPatch.set($(e.currentTarget).val());
  },
  'change .cardsByPatch_query': function() {
    var queryString = [];
    $('.cardsByPatch_query').each(function() {
      var $query = $(this);

      if ($query.val().length !== 0) {
        var query = $query.attr('name').split('_')[1];
        var value = $query.val();
        queryString.push(query + '=' + value);
      }
    })

    queryString = queryString.join('&');
    if (queryString.length > 0) {
      queryString = queryString + '&';
    }

    Template.instance().cardsByPatchQuery.set(queryString);
  },
  'change .cardById_id': function(e) {
    Template.instance().cardByIdId.set($(e.currentTarget).val());
  },
  'change .cardById_query': function() {
    var queryString = [];
    $('.cardById_query').each(function() {
      var $query = $(this);

      if ($query.val().length !== 0) {
        var query = $query.attr('name').split('_')[1];
        var value = $query.val();
        queryString.push(query + '=' + value);
      }
    })

    queryString = queryString.join('&');
    if (queryString.length > 0) {
      queryString = queryString + '&';
    }

    Template.instance().cardByIdQuery.set(queryString);
  }
})
