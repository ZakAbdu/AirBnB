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
      },
      {
        url: 'https://photos.zillowstatic.com/fp/9f5c92bb314e1439f88f88d4028e4a0a-p_e.jpg',
        preview: true,
        spotId: 1
      },
      {
        url: 'https://photos.zillowstatic.com/fp/1107e2124d828cbc8fde5efb09a3067a-p_e.jpg',
        preview: true,
        spotId: 3
      },
      {
        url: 'https://imageio.forbes.com/specials-images/imageserve/60d25ac770164281ac67c3cf/Three-story-contemporary-home-in-San-Francisco/960x0.jpg?format=jpg&width=960',
        preview: true,
        spotId: 2
      },
      {
        url: 'https://www.jamesedition.com/stories/wp-content/uploads/2020/10/18.jpg',
        preview: true,
        spotId: 4
      },
       {
        url: 'https://s.wsj.net/public/resources/images/BN-HS150_0402pp_M_20150402130345.jpg',
        preview: true,
        spotId: 5
       },
       {
        url: 'https://galeriemagazine.com/wp-content/uploads/2019/01/Dining_3-1920x1200.jpg',
        preview: false,
        spotId: 4
       },
       {
        url: 'https://www.57ocean.com/wp-content/themes/57ocean/images/57OCEAN_PH_01_Living.jpg',
        preview: false,
        spotId: 5
       }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {})
  }
};
