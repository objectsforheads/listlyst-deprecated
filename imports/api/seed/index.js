// // Import patch data
//
// // Alpha patches
// import './patch/p0_0_1.js';
// import './patch/p0_0_2.js';
// import './patch/p0_0_3.js';
// import './patch/p0_0_4.js';
// import './patch/p0_0_5.js';
// import './patch/p0_0_6.js';
// import './patch/p0_0_7.js';
// import './patch/p0_0_8.js';
// import './patch/p0_0_9.js';
// import './patch/p0_0_10.js';
// import './patch/p0_0_11.js';
// import './patch/p0_0_12.js';
// import './patch/p0_0_13.js';
// import './patch/p0_0_14.js';
// import './patch/p0_0_15.js';
// import './patch/p0_0_16.js';
// import './patch/p0_0_17.js';
// import './patch/p0_0_18.js';
// import './patch/p0_0_19.js';
// import './patch/p0_0_20.js';
// import './patch/p0_0_21.js';
// import './patch/p0_0_22.js';
// import './patch/p0_0_23.js';
// import './patch/p0_0_24.js';
// import './patch/p0_0_25.js';
// import './patch/p0_0_26.js';
// import './patch/p0_0_27.js';
// import './patch/p0_0_28.js';
// import './patch/p0_0_29.js';
// import './patch/p0_0_30.js';
// import './patch/p0_0_31.js';
// import './patch/p0_0_32.js';
//
// // Beta patches
// import './patch/p0_33.js';
// import './patch/p0_34.js';
// import './patch/p0_35.js';
// import './patch/p0_36.js';
// import './patch/p0_37.js';
// import './patch/p0_38.js';
// import './patch/p0_39.js';
// import './patch/p0_40.js';
// import './patch/p0_41.js';
// import './patch/p0_42.js';
// import './patch/p0_43.js';
// import './patch/p0_44.js';
// import './patch/p0_45.js';
// import './patch/p0_46.js';
// import './patch/p0_47.js';
// import './patch/p0_48.js';
// import './patch/p0_49.js';
// import './patch/p0_50.js';
// import './patch/p0_51.js';
// import './patch/p0_52.js';
// import './patch/p0_53.js';
// import './patch/p0_54.js';
// import './patch/p0_55.js';
// import './patch/p0_56.js';
// import './patch/p0_57.js';
// import './patch/p0_58.js';
// import './patch/p0_59.js';
// import './patch/p0_60.js';
// import './patch/p0_61.js';
import './patch/p0_62.js';

// Post-release patches
import './patch/p1_63.js';
import './patch/p1_64.js';
import './patch/p1_65.js';
import './patch/p1_66.js';
import './patch/p1_67.js';
import './patch/p1_69.js';
import './patch/p1_71.js';
import './patch/p1_73.js';
import './patch/p1_74.js';
import './patch/p1_75.js';
import './patch/p1_76.js';

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
addPatch(p1_73, 1.73);
addPatch(p1_74, 1.74);
addPatch(p1_75, 1.75);
addPatch(p1_76, 1.76);
