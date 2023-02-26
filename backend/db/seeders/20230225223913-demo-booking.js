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
        startDate: '2023-10-15',
        endDate: '2023-10-29'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2023-12-21',
        endDate: '2024-01-05'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2023-03-21',
        endDate: '2023-03-28'
      },
      {
        spotId: 4,
        userId: 3,
        startDate: '2023-06-01',
        endDate: '2023-06-21'
      },
      {
        spotId: 5,
        userId: 2,
        startDate: '2023-11-11',
        endDate: '2023-11-21'
      },
      {
        spotId: 1,
        userId: 4,
        startDate: '2023-09-21',
        endDate: '2023-09-30'
      }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {})
  }
};

