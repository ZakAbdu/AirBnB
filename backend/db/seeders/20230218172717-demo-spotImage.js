'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        url: 'https://img.gtsstatic.net/reno/imagereader.aspx?imageurl=https%3A%2F%2Fsir.azureedge.net%2F1194i215%2F3r92jhgx9js24t62rg80fzk107i215&option=N&h=472&permitphotoenlargement=false',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://asset.mansionglobal.com/editorial/san-francisco-s-victorians--small-in-number--high-in-history-and-beauty/assets/6KUTkIzKR0/sr_sf_lead-2560x2560.jpeg',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://www.reviewjournal.com/wp-content/uploads/2022/03/16244880_web1_copy_4soaringbirdcourt-108.jpg?crop=1',
        preview: false,
        spotId: 3
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
