// Import patch data
import './patch/p0_62.js';
import './patch/p1_63.js';
import './patch/p1_64.js';
import './patch/p1_65.js';
import './patch/p1_66.js';
import './patch/p1_67.js';
import './patch/p1_69.js';
import './patch/p1_71.js';
import './patch/p1_73.js';
import './patch/p1_74.js';

function addPatch(cards, patch) {
  cards.forEach(function(card) {
    newCard = card;

    // If the card doesn't exist in the database yet, add it.
    if ( CardsCurrent.find({ 'id': card.id }, { limit: 1 }).count() === 0 ) {
      CardsCurrent.insert(newCard);
    }
    // Otherwise, update the entry in the current set,
    else {
      currentCard = CardsCurrent.findOne({ 'id': card.id });
      dbId = currentCard._id;

      CardsCurrent.update({ _id: dbId }, newCard)
    }

    // Then add a copy to the historical data.
    newCard.patch = patch;
    CardsHistorical.insert(newCard);
  });
}

CardsCurrent.remove({});
CardsHistorical.remove({});

addPatch(p0_62, 0.62);
addPatch(p1_63, 1.63);
addPatch(p1_64, 1.64);
addPatch(p1_65, 1.65);
addPatch(p1_66, 1.66);
addPatch(p1_67, 1.67);
addPatch(p1_69, 1.69);
addPatch(p1_71, 1.71);
addPatch(p1_71, 1.73);
addPatch(p1_71, 1.74);
