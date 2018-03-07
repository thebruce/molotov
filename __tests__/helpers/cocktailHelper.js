const Cocktail = require('../../lib/cocktail');

const cocktailMixins = require('./cocktailMixins');
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
          'mixinOne',
        ],
        pluginOneTwo: [
          'mixinOne',
          'mixinTwo',
          'mixinFour',
        ],
        pluginAll: [
          'mixinFour',
        ],
      },
      testSuperTwo: {
        pluginSeven: [
          'mixinSeven',
        ],
      },
    },
  },
};

class CocktailHelper extends Cocktail {
  constructor() {
    super(cocktailConfig, cocktailSupers, cocktailMixins);
  }
}

module.exports = new CocktailHelper();
