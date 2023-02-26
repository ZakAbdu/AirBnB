'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
      firstName: 'Demo',
      lastName: 'userOne',
      email: 'demo@user.io',
      username: 'Demo-lition-1',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      firstName: 'DemoTwo',
      lastName: 'userTwo',
      email: 'user2@user.io',
      username: 'FakeUser2',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      firstName: 'Fake',
      lastName: 'userThree',
      email: 'user3@user.io',
      username: 'FakeUser3',
      hashedPassword: bcrypt.hashSync('password3')
    },
    {
      firstName: 'Zak',
      lastName: 'Abdu',
      email: 'zakabdu@io.com',
      username: 'ZakAbdu25',
      hashedPassword: bcrypt.hashSync('password25')
    }
  ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2']}
    }, {});
  }
};

