'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-10-22',
        endDate: '2023-10-30'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023-03-18',
        endDate: '2023-03-28'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023-12-25',
        endDate: '2024-01-05'
      }
    ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: {[Op.in]: [1, 2, 3]}
    }, {})
  }
};
