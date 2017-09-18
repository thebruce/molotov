import test from 'ava';

const path = require('path');
const requireDirectory = require('require-directory');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

// Config is now
const config = {
  testPackage: {
    testSuper: {
      supersOverride: '/test/helpers/testSuperOverride'
    },
    molotovPlugins: [
      '/test/helpers/cocktailHelper'
    ]
  },
  molotov: {
    cocktailPlugins: {
      testPackage: {
        testSuper: {
          pluginOneTwo: [
            'pluginOne',
            'pluginTwo',
            'pluginFour'
          ],
          pluginNumbus: [
            'pluginThree'
          ]
        }
      }
    }
  }
};

// Need to mock a molotov providing module to pass along to cocktail.
// As cocktail would be overriding that module.
const Molotov = require('../molotov');

const molotovPlugins = requireDirectory(module, './helpers/plugins');
const molotovSupers = {
  testSuper: require('./helpers/supers/testSuper')
};

const molotov = new Molotov('./test/helpers/', 'testPackage', molotovSupers, molotovPlugins, config);

// Now require cocktail and its classes.
const Cocktail = require('../cocktail');

const cocktailManualPluginDefinitions = {
  testSuper: {
    pluginNumbus: [
      'pluginThree'
    ]
  }
};

// Test for bad path rejection.
test('cocktailInvocation', (t) => {
  const cocktail = new Cocktail(molotov, cocktailManualPluginDefinitions);

  t.context.data = cocktail.resolve();

  t.deepEqual(
    Object.keys(t.context.data.testSuper).sort(),
    [
      'pluginNumbus'
    ]
  );
});
