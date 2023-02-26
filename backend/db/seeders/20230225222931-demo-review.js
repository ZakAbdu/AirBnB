'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 2,
        review: 'We had the most wonderful time at this AirBnB. Pefect',
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Most beautiful city ever and an amazing AirBnB. Had an amazing time.',
        stars: 4
      },
      {
        userId: 2,
        spotId: 3,
        review: 'This AirBnB was dirty and in a very sketchy location. Would not recommened.',
        stars: 0
      },
      {
        userId: 2,
        spotId: 4,
        review: 'Amazing stay and views right in middle of Manhattan. Unforgettable experience and will definitely be booking with Zak again.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 5,
        review: 'Me and my large group had the time of our lives!! Extremely luxurious suite with unrivaled views and amazing location right in the middle of downtown Miami. Will 100% be booking again with Zak.',
        stars: 5
      },
      {
        userId: 4,
        spotId: 1,
        review: 'Fell in love with this city thanks to the amazing stay I had. Large home for entire family and minutes away from beaches and major attractions. Cannot wait to visit San Diego again and book this home again.',
        stars: 5
      }
    ], {});
   
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: {[Op.in]: [1, 2, 3, 4]}
    }, {})
  }
};
