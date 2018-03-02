const Cocktail = require('../../lib/cocktail');

const cocktailPlugins = require('./cocktailPlugins');
const cocktailSupers = require('./cocktailSupers');

// This could be passed in.
const cocktailConfig = {
  testMolotovImplementer: {
    supersNameSpace: {
      testSuperTwo: 'testSuperTwo',
      testSuper: 'testSuper',
    },
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
      testSuperTwo: {
        pluginSeven: [
          'pluginSeven',
        ],
      },
    },
  },
};

class CocktailHelper extends Cocktail {
  constructor() {
    super(cocktailConfig, cocktailSupers, cocktailPlugins);
  }
}

module.exports = new CocktailHelper();
