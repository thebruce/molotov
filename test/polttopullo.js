import test from 'ava';

const requireDirectory = require('require-directory');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

const config = {
  testPackage: {
    testSuper: {
      supersOverride: '/test/helpers/testSuperOverride'
    }
  }
};

const MixedDrink = require('../polttopullo');

const plugins = requireDirectory(module, './helpers/plugins');
const supers = {
  testSuper: require('./helpers/supers/testSuper')
};

test('getPlugins', async (t) => {
  const mixedDrink = new MixedDrink(
    './test/helpers/',
    supers,
    plugins,
    config
  );

  t.context.data = await mixedDrink.resolve();
  t.deepEqual(
    Object.keys(t.context.data.testSuper).sort(),
    [
      'onlyPluginOne',
      'pluginAll',
      'pluginOneTwo'
    ]
  );
});


test('getPlugins no config', async (t) => {
  const mixedDrink = new MixedDrink(
    './test/helpers/',
    supers,
    plugins
  );

  t.context.data = await mixedDrink.resolve();
  t.deepEqual(
    Object.keys(t.context.data.testSuper).sort(),
    [
      'onlyPluginOne',
      'pluginAll',
      'pluginOneTwo'
    ]
  );
});

test('getCrazy with Dynamic Plugins', async (t) => {
  const dynamicPlugs = {
    testSuper: {
      drunkyDrunkerson: [
        'pluginOne',
        'pluginThree'
      ]
    }
  };
  const mixedDrink = new MixedDrink(
    './test/helpers/',
    supers,
    plugins
  );

  t.context.data = await mixedDrink.resolve(dynamicPlugs);
  t.deepEqual(
    Object.keys(t.context.data.testSuper).sort(),
    [
      'drunkyDrunkerson',
      'onlyPluginOne',
      'pluginAll',
      'pluginOneTwo'
    ]
  );
});
