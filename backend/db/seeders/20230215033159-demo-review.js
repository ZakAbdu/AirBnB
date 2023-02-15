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
        stars: 5
      },
      {
        userId: 2,
        spotId: 3,
        review: 'This AirBnB was dirty and in a very sketchy location. Would not recommened.',
        stars: 0
      }
    ], {});
   
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: {[Op.in]: [1, 2, 3]}
    }, {})
  }
};
