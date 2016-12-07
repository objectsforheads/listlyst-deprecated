import './demo.html';
import '../components/loadingScreen.html';

Template.registerHelper('demo_arrayifyPatchwork',function(obj){
    var result = [];
    for (var key in obj) result.push({patch: key, card:obj[key]});
    return result;
});

Template.demo.onCreated(function() {
  var patches = ServerInfo.findOne().patches;

  Meteor.call('demoAPIAccess', patches, function(error, data) {
    if (error) {
      return console.log(error);
    }
    else {
      // Got all the cards from the API and concatenated the results.
      var allCards = data;

      // Now we need to sort them into an array to pass to our template,
      // who we'll leave responsible for getting this data to the DOM.

      // To do that, we'll need to keep track of our cards.
      var cardIds = [];
      // We'll also need a new container for the sorted cards.
      var sortedCards = [];

      allCards.forEach(function(card, index) {
        // We need 2 sets of data - canonical and per-patch
        // We'll use canonical for all of our filters later on
        // And per-patch for the diff feature

        var cardId = card.id;
        var patch = card.patch;
        delete card.id;
        delete card.patch;

        var cardIndex = cardIds.indexOf(cardId);

        if (cardIndex === -1) {
          cardIds.push(cardId);
          // Build the container for the card in sortedCards by cloning the card.
          var sortedCard = JSON.parse(JSON.stringify(card));
          sortedCard.id = cardId;
          sortedCard.patch = patch;
          // Then add the card to its new container.
          sortedCard.patches = {};
          sortedCard.patches[patch] = card;
          // And then the container to the array
          sortedCards.push(sortedCard);
        }
        else {
          // If the card's already been added once, use the index to find it
          // Having done that, add the patch info to the patches key
          sortedCards[cardIndex].patches[patch] = card;

          // If this info is more up to date than canonical, update canonical
          if (sortedCards[cardIndex].patch < patch) {
            for (var attr in card) {
              sortedCards[cardIndex].patch = patch;
              sortedCards[cardIndex][attr] = card[attr];
            }
          }
        }
      })
      // Sort the cards by faction then by name
      sortedCards.sort(function(a,b) {
        if (a.faction < b.faction) {
          return -1;
        }
        if (a.faction > b.faction) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      return Session.set('patchwork', sortedCards);
    }
    return false;
  })
})

Template.demo.helpers({
  cards: function() {
    return Session.get('patchwork');
  }
});

Template.demo_cardHistory.helpers({
  cardInfo: function() {
    var info = JSON.stringify(this.card);
    info = info.replace(/,/g, ',\n');
    return info;
  },
  attributes: function() {
    var card = this;
    var attrObj = {};
    var attrs = ['faction','rarity','name','manaCost','type','race','attack','health','set']
    attrs.forEach(function(attr) {
      if (card[attr] !== undefined) {
        var key = 'data-' + attr;
        var value = card[attr];
        attrObj[key] = value;
      }
    })
    return attrObj;
  }
})

Template.demo_filterFiltersContainer.helpers({
  filters: function() {
    var filters = [
      {
        'handle': 'faction',
        'name': 'Faction',
        'type': 'checkbox',
        'options': ['Abyssian Host', 'Lyonar Kingdoms', 'Magmar Aspects', 'Songhai Empire', 'Vanar Kindred', 'Vetruvian Imperium', 'Neutral']
      },
      {
        'handle': 'rarity',
        'name': 'Rarity',
        'type': 'checkbox',
        'options': ['Basic', 'Common', 'Rare', 'Epic', 'Legendary']
      },
      {
        'handle': 'manaCost',
        'name': 'Mana Cost',
        'type': 'range',
        'options': [0,25]
      },
      {
        'handle': 'type',
        'name': 'Type',
        'type': 'checkbox',
        'options': ['Artifact', 'Spell', 'Unit']
      },
      {
        'handle': 'race',
        'name': 'Race',
        'type': 'checkbox',
        'options': ['General', 'Arcanyst', 'Battle Pet', 'Dervish', 'Golem', 'Mech', 'Minion', 'Structure', 'Vespyr', 'Warmaster', 'Spell', 'Artifact']
      },
      {
        'handle': 'attack',
        'name': 'Attack',
        'type': 'range',
        'options': [0,12]
      },
      {
        'handle': 'health',
        'name': 'Health',
        'type': 'range',
        'options': [1,25]
      }
    ]
    return filters;
  }
})

Template.demo_filterFilter.onCreated(function() {
  this.filterName = new ReactiveVar(null);
  this.filterValue = new ReactiveVar(null);
})

Template.demo_filterFiltersContainer.onRendered(function() {
  // HACK: currently 3x noUiSlider and not pulling the data from spacebars
  // TODO: move to a child template and put noUiSlider on its onRendered function
  var slider_manaCost = document.getElementById('filter-filter__manaCost');
  noUiSlider.create(slider_manaCost, {
  	start: [0, 25],
    margin: 1,
    step: 1,
  	connect: true,
  	range: {
  		'min': 0,
  		'max': 25
  	},
  	pips: {
  		mode: 'positions',
  		values: [0,20,40,60,80,100],
  		density: 3.84615384615
  	},
  	format: {
  	  to: function ( value ) {
  		return value;
  	  },
  	  from: function ( value ) {
  		return value;
  	  }
  	}
  });
  slider_manaCost.noUiSlider.on('change', function() {
    $('.card-history-container').removeClass(function (index, css) {
      return (css.match (/(^|\s)(filter-filter__manaCost)\S+/g) || []).join(' ');
    });
    var range = slider_manaCost.noUiSlider.get()
    $('.card-history-container').addClass('filter-filter__manaCost-' + range[0] + ' filter-filter__manaCost-' + range[1]);
  })
  var slider_health = document.getElementById('filter-filter__health');
  noUiSlider.create(slider_health, {
  	start: [0, 25],
    margin: 1,
    step: 1,
  	connect: true,
  	range: {
  		'min': 0,
  		'max': 25
  	},
  	pips: {
  		mode: 'positions',
  		values: [0,20,40,60,80,100],
  		density: 3.84615384615
  	},
  	format: {
  	  to: function ( value ) {
  		return value;
  	  },
  	  from: function ( value ) {
  		return value;
  	  }
  	}
  });
  slider_health.noUiSlider.on('change', function() {
    $('.card-history-container').removeClass(function (index, css) {
      return (css.match (/(^|\s)(filter-filter__health)\S+/g) || []).join(' ');
    });
    var range = slider_health.noUiSlider.get()
    $('.card-history-container').addClass('filter-filter__health-' + range[0] + ' filter-filter__health-' + range[1]);
  })
  var slider_attack = document.getElementById('filter-filter__attack');
  noUiSlider.create(slider_attack, {
  	start: [0, 12],
    margin: 1,
    step: 1,
  	connect: true,
  	range: {
  		'min': 0,
  		'max': 12
  	},
  	pips: {
      mode: 'count',
  		values: 5,
  		density: 8.33
  	},
  	format: {
  	  to: function ( value ) {
  		return value;
  	  },
  	  from: function ( value ) {
  		return value;
  	  }
  	}
  });
  slider_attack.noUiSlider.on('change', function() {
    $('.card-history-container').removeClass(function (index, css) {
      return (css.match (/(^|\s)(filter-filter__attack)\S+/g) || []).join(' ');
    });
    var range = slider_attack.noUiSlider.get()
    $('.card-history-container').addClass('filter-filter__attack-' + range[0] + ' filter-filter__attack-' + range[1]);
  })
})

Template.demo_filterFilter.helpers({
  isInputRange: function() {
    if (this.type === 'range') {
      return true;
    }
    return false;
  },
  isInputCheckbox: function() {
    if (this.type === 'checkbox') {
      return true;
    }
    return false;
  },
  getFilterName: function() {
    return Template.instance().filterName.set(this.name);
  },
  passFilterName: function() {
    return Template.instance().filterName.get();
  }
})

Template.demo_filterFilterInput.events({
  'click .filter-filter--checkbox': function(e) {
    $(e.currentTarget).closest('.filter-filter-wrapper').toggleClass('selected');
    // There are too many possible combinations of filters to practically modify
    // based on class in the .card-history-container like we do for sort-filter
    // Instead, we'll add a css block to only show the filtered for cards

    // First, if no filters are selected, show all
    var filtersActive = $('.filter-filter--checkbox:checked').val();
    // If any filters are checked, add/remove filter based on user input
    if (filtersActive === undefined) {
      $('.card-history-container').removeClass('filter-filter');
    }
    // Otherwise, check to see what filters are checked and convert them into selectors
    else {
      $('.card-history-container').addClass('filter-filter');
      var filters = {faction:[], rarity:[],type:[],race:[]};

      $('.filter-filter-container').each(function() {
        var $container = $(this);

        if ($container.find('.filter-filter--checkbox:checked').val() !== undefined) {
          // If this container has checked filters, push them to the filters container
          var filterName = $container.find('h3').text().toLowerCase();

          $container.find('.filter-filter--checkbox:checked').each(function() {
            var $checkbox = $(this);
            var filterValue = $checkbox.val();

            var filter = '[data-' + filterName + '="' + filterValue + '"]';

            filters[filterName].push(filter)
          })
        }
      })

      // Once all the filters have been gathered, create the CSS

      // Start by arrayifying the object
      filtersArray = [];
      for (var filter in filters) {
        if (filters[filter].length !== 0) {
          filtersArray.push(filters[filter]);
        }
      }

      // Then sort out all possible combinations into a string
      var classes = generateFilterFilterClasses(filtersArray);
      classes = classes.map(function(thisClass) {
        return '.card-history.card-history.card-history' + thisClass;
      });
      classes = classes.join();

      // Complete the CSS string
      var css = "/* css block filter filter styling */ " + classes + " {display:initial;}"

      // CSS created, check if the stylesheet exists - create if no, replace if yes
      if ($('style.filterFilterCSS').length === 0) {
        $('head').append('<style type="text/css" class="filterFilterCSS">' + css + '</style>')
      }
      else {
        $('style.filterFilterCSS').text(css);
      }
    }

    function generateFilterFilterClasses(filters) {
      if (filters.length === 1) {
        return filters[0];
      }
      else if (filters.length > 1) {
        var classes = [];
        var nextFilters = generateFilterFilterClasses(filters.slice(1))
        for (var filter in nextFilters) {
          for (var i = 0; i < filters[0].length; i++) {
            classes.push(filters[0][i] + nextFilters[filter])
          }
        }
        return classes;
      }
    }
  }
})


Template.demo_sortFiltersContainer.onCreated(function() {
  this.firstSortFilter = new ReactiveVar(null);
})

Template.demo_sortFiltersContainer.helpers({
  firstSortFilter: function() {
    return Template.instance().firstSortFilter.get();
  }
})

Template.demo_sortFiltersContainer.events({
  'click .first-filter>.sort-filter': function(e, template) {
    return template.firstSortFilter.set($(e.currentTarget).val());
  },
  'click .sort-filter-wrapper': function(e) {
    $(e.currentTarget).siblings().removeClass('selected');
    $(e.currentTarget).addClass('selected');
  },
  'click .sortCards': function(e) {
    $('.card-history-container').removeClass(function (index, css) {
      return (css.match (/(^|\s)(sort-filter)\S+/g) || []).join(' ');
    });
    // Report back the sorter values
    var sort1 = $('[name="first-sort-filter"]:checked').val() || false
    var asc1 = $('[name="first-sort-filter"]:checked').siblings('input[type="checkbox"]').prop('checked')
    var sort2 = $('[name="second-sort-filter"]:checked').val()
    var asc2 = $('[name="second-sort-filter"]:checked').siblings('input[type="checkbox"]').prop('checked') || false

    // Prevent double-selecting filters
    if (sort1 === sort2) {
      $('[name="second-sort-filter"]:checked').removeAttr('checked')
      sort2 = $('[name="second-sort-filter"]:checked').val()
    }

    asc1 = asc1 ? 'desc' : 'asc';
    asc2 = asc2 ? 'desc' : 'asc';

    if (sort2) {
      tinysort('.card-history-container > .card-history', {data:sort1, order: asc1, returns: true, place: 'first'}, {data:sort2, order: asc2, returns: true, place: 'first'});
      $('.card-history-container').addClass('sort-filter__show-only-' + sort1 + ' sort-filter__show-only-' + sort2)
    }
    else {
      tinysort('.card-history-container > .card-history', {data:sort1, order: asc1, returns: true, place: 'first'});
      $('.card-history-container').addClass('sort-filter__show-only-' + sort1)
    }
  }
})

Template.demo_sortFilters.onCreated(function() {
  this.filterSelect = new ReactiveVar(null);
  this.filterOrder = new ReactiveVar(null);
  this.filterDisabled = new ReactiveVar(null);
})

Template.demo_sortFilters.helpers({
  filters: function() {
    return ['faction', 'rarity', 'name', 'manaCost', 'type', 'race', 'attack', 'health']
  },
  filterSelected: function() {
    return Template.instance().filterSelect.get();
  },
  filterOrder: function() {
    return Template.instance().filterOrder.set(this.order)
  },
  passfilterOrder: function() {
    return Template.instance().filterOrder.get()
  },
  filterDisabled: function() {
    return Template.instance().filterDisabled.set(this.disabled)
  },
  passDisabled: function() {
    return Template.instance().filterDisabled.get()
  }
})

Template.demo_sortFilters.events({
  'click .sort-filter': function(e, template) {
    return template.filterSelect.set($(e.currentTarget).val());
  },
  'click .first-filter .sort-filter': function(e, template) {
    return template.filterDisabled.set($(e.currentTarget).val());
  }
})

Template.demo_sortFilter.helpers({
  filterName: function() {
    camelCase = this.name.split(/(?=[A-Z])/).join(" ").toLowerCase();
    return camelCase;
  },
  isSelected: function() {
    return this.name !== this.value;
  },
  firstFilter: function() {
    if (this.disabled && this.name) {
      return this.disabled === this.name;
    }
    return false;
  }
})
