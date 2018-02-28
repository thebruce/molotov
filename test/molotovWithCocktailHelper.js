import test from 'ava';

const requireDirectory = require('require-directory');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// set up test config dirs.
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
const Molotov = require('../molotov');

const plugins = requireDirectory(module, './helpers/plugins');
const supers = {
  testSuper: require('./helpers/supers/testSuper')
};

// Test for bad path rejection.
test('molotov', async (t) => {
  const molotov = new Molotov('./test/helpers/', 'testPackage', supers, plugins, config);
  t.context.data = await molotov.getMolotov()
  .then((newMolotov) => {
    // Get all of the molotov plugins for our module.
    const molotovPlugins = newMolotov.resolve();
    return molotovPlugins;
  });

  t.deepEqual(
    Object.keys(t.context.data.testSuper).sort(),
    [
      'onlyPluginOne',
      'pluginAll',
      'pluginFour',
      'pluginNumbus',
      'pluginOneTwo'
    ]
  );
});
