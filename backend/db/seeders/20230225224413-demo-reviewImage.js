'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://www.mansionglobal.com/articles/san-franciscos-victorians-small-in-number-high-in-history-and-beauty-222912'
      },
      {
        reviewId: 2,
        url: 'https://www.jamesedition.com/real_estate/san-diego-ca-usa/ultra-private-custom-estate-with-ocean-breeze-in-san-diego-11131461'
      },
      {
        reviewId: 3,
        url: 'https://www.mansionglobal.com/articles/the-most-expensive-listing-in-southern-nevada-asks-32-5-million-01629240080'
      },
      {
        reviewId: 4,
        url: 'https://thumbs.cityrealty.com/assets/smart/736x/webp/e/e2/e2d6f8ccd904009009fd9df61a7fec8e434660ed/808-broadway-01.jpg'
      }, 
      {
        reviewId: 5,
        url: 'https://a0.muscache.com/im/pictures/monet/Luxury-617956837498330935/original/1b1b10e8-15ea-40ee-bb72-55be90dca789?im_w=720'
      },
      {
        reviewId: 6,
        url: 'https://mlsandiegomag.com/get/files/image/galleries/El_Vuelo.jpg'
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {})
  }
};

