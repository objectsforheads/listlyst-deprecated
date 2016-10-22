import './documentation.html';

Template.documentation.onCreated(function() {
  Meteor.subscribe('APIKeys');

  this.allCardsQuery = new ReactiveVar(null);
  this.request_allCards = new ReactiveVar(null);
  this.allCards_responseStatus = new ReactiveVar(null);
  this.allCards_responseHeader = new ReactiveVar(null);
  this.allCards_responseBody = new ReactiveVar(null);

  this.cardsByPatchPatch = new ReactiveVar('[:patch]');
  this.cardsByPatchQuery = new ReactiveVar(null);
  this.request_cardsByPatch = new ReactiveVar(null);
  this.cardsByPatch_responseStatus = new ReactiveVar(null);
  this.cardsByPatch_responseHeader = new ReactiveVar(null);
  this.cardsByPatch_responseBody = new ReactiveVar(null);

  this.cardByIdId = new ReactiveVar('[:id]');
  this.cardByIdQuery = new ReactiveVar(null);
  this.request_cardById = new ReactiveVar(null);
  this.cardById_responseStatus = new ReactiveVar(null);
  this.cardById_responseHeader = new ReactiveVar(null);
  this.cardById_responseBody = new ReactiveVar(null);
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
    return location.protocol + '//' + location.host + '/api/v1/';
  },
  'userAPIKey': function() {
    return APIKeys.findOne() ? APIKeys.findOne().key : "[yourKey]"
  },
  'allCards_queries': function() {
    return Template.instance().allCardsQuery.get();
  },
  'request_allCards': function() {
    return Template.instance().request_allCards.get();
  },
  'allCards_responseStatus': function() {
    return Template.instance().allCards_responseStatus.get();
  },
  'allCards_responseHeader': function() {
    return Template.instance().allCards_responseHeader.get();
  },
  'allCards_responseBody': function() {
    return Template.instance().allCards_responseBody.get();
  },
  'cardsByPatch_patch': function() {
    return Template.instance().cardsByPatchPatch.get();
  },
  'cardsByPatch_queries': function() {
    return Template.instance().cardsByPatchQuery.get();
  },
  'request_cardsByPatch': function() {
    return Template.instance().request_cardsByPatch.get();
  },
  'cardsByPatch_responseStatus': function() {
    return Template.instance().cardsByPatch_responseStatus.get();
  },
  'cardsByPatch_responseHeader': function() {
    return Template.instance().cardsByPatch_responseHeader.get();
  },
  'cardsByPatch_responseBody': function() {
    return Template.instance().cardsByPatch_responseBody.get();
  },
  'cardById_id': function() {
    return Template.instance().cardByIdId.get();
  },
  'cardById_queries': function() {
    return Template.instance().cardByIdQuery.get();
  },
  'request_cardById': function() {
    return Template.instance().request_cardById.get();
  },
  'cardById_responseStatus': function() {
    return Template.instance().cardById_responseStatus.get();
  },
  'cardById_responseHeader': function() {
    return Template.instance().cardById_responseHeader.get();
  },
  'cardById_responseBody': function() {
    return Template.instance().cardById_responseBody.get();
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
  'input .cardsByPatch_patch': function(e) {
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
  'input .cardById_id': function(e) {
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
  },
  'submit .api-request': function(e) {
    e.preventDefault();
    var template = Template.instance()
    var url = $(e.currentTarget).serializeArray()[0].value;

    switch($(e.currentTarget).attr('id')) {
      case 'apiRequest_allCards':
        template.request_allCards.set(true);
        template.allCards_responseStatus.set(null);
        template.allCards_responseHeader.set(null);
        template.allCards_responseBody.set(null);
        HTTP.get(url, {}, function(err, data)  {
          template.allCards_responseStatus.set(data.statusCode);
          template.allCards_responseHeader.set(JSON.stringify(data.headers, null, 2));
          if (!err) {
            template.allCards_responseBody.set(JSON.stringify(data.data, null, 2));
          }
        })
        break
      case 'apiRequest_cardsByPatch':
        template.request_cardsByPatch.set(true);
        template.cardsByPatch_responseStatus.set(null);
        template.cardsByPatch_responseHeader.set(null);
        template.cardsByPatch_responseBody.set(null);
        HTTP.get(url, {}, function(err, data)  {
          template.cardsByPatch_responseStatus.set(data.statusCode);
          template.cardsByPatch_responseHeader.set(JSON.stringify(data.headers, null, 2));
          if (!err) {
            template.cardsByPatch_responseBody.set(JSON.stringify(data.data, null, 2));
          }
        })
        break
      case 'apiRequest_cardById':
        template.request_cardById.set(true);
        template.cardById_responseStatus.set(null);
        template.cardById_responseHeader.set(null);
        template.cardById_responseBody.set(null);
        HTTP.get(url, {}, function(err, data)  {
          template.cardById_responseStatus.set(data.statusCode);
          template.cardById_responseHeader.set(JSON.stringify(data.headers, null, 2));
          if (!err) {
            template.cardById_responseBody.set(JSON.stringify(data.data, null, 2));
          }
        })
        break
    }
  }
})
