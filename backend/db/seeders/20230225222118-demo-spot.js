'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Spot Dr.',
        city: 'San Diego',
        state: 'California',
        country: 'USA',
        lat: 32.7157,
        lng: 117.1611,
        name: 'Vacation Stay',
        description: 'Great vacation home for entire your entire family. Minutes from beach',
        price: 150.00
      },
      {
        ownerId: 2,
        address: '555 User St.',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 37.7749,
        lng: 122.4194,
        name: 'Getaway in the Bay',
        description: 'Pefect 2-story home for your family vacation or group trip. Minutes from downtown San Francisco and famous attractions.',
        price: 199.99
      },
      {
        ownerId: 3,
        address: '21 Jump St.',
        city: 'Las Vegas',
        state: 'Nevada',
        country: 'USA',
        lat: 36.1716,
        lng: 115.1391,
        name: 'Sin City Jewel',
        description: 'This 3-story home is the perfect destination for whatever your trip entails!',
        price: 299.99
      },
      {
        ownerId: 4,
        address: '0325 March Dr.',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Big Apple Penthouse',
        description: 'Amazing highrise located in downtown Manhattan. Jaw-dropping views and minutes from Central Park and other major attractions.',
        price: 499.99
      },
      {
        ownerId: 4,
        address: '1234 Fly St.',
        city: 'Miami',
        state: 'Florida',
        country: 'USA',
        lat: 25.7617,
        lng: 80.1918,
        name: 'Diamond on Biscayne',
        description: "This luxurious penthouse suite is located right in downtown Miami on Ocean Dr and Biscayne Blvd. Views and nightlife like no other.",
        price: 699.99
      }
    ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      city: { [Op.in]: ['San Diego', 'San Francisco', 'Las Vegas', 'New York', 'Miami'] }
    }, {})
  }
};
