const Cocktail = require('../../lib/cocktail');

const cocktailPlugins = require('./cocktailPlugins');
const cocktailSupers = require('./cocktailSupers');

// This could be passed in.
const cocktailConfig = {
  testMolotovImplementer: {
    supersNameSpace: [
      'testSuper',
    ],
    molotovPlugins: {
      testSuper: {
        onlyPluginOne: [
          'pluginOne',
        ],
        pluginOneTwo: [
          'pluginOne',
          'pluginTwo',
          'pluginFour',
        ],
        pluginAll: [
          'pluginFour',
        ],
      },
    },
  },
};

class CocktailHelper extends Cocktail {
  constructor() {
    super(cocktailConfig, cocktailPlugins, cocktailSupers);
  }
}

module.exports = new CocktailHelper();
