const requireDirectory = require('require-directory');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

const config = {
  testPackage: {
    testSuper: {
      supersOverride: '/test/helpers/testSuperOverride',
    },
  },
};

const MixedDrink = require('../polttopullo');

const plugins = requireDirectory(module, './helpers/plugins');
const supers = {
  testSuper: require('./helpers/supers/testSuper'),
};

test('getPlugins', async () => {
  const mixedDrink = new MixedDrink(
    './test/helpers/',
    supers,
    plugins,
    config
  );

  t.context.data = await mixedDrink.resolve();
  expect(Object.keys(t.context.data.testSuper).sort()).toEqual([
    'onlyPluginOne',
    'pluginAll',
    'pluginOneTwo',
  ]);
});


test('getPlugins no config', async () => {
  const mixedDrink = new MixedDrink(
    './test/helpers/',
    supers,
    plugins
  );

  t.context.data = await mixedDrink.resolve();
  expect(Object.keys(t.context.data.testSuper).sort()).toEqual([
    'onlyPluginOne',
    'pluginAll',
    'pluginOneTwo',
  ]);
});

test('getCrazy with Dynamic Plugins', async () => {
  const dynamicPlugs = {
    testSuper: {
      drunkyDrunkerson: [
        'pluginOne',
        'pluginThree',
      ],
    },
  };
  const mixedDrink = new MixedDrink(
    './test/helpers/',
    supers,
    plugins
  );

  t.context.data = await mixedDrink.resolve(dynamicPlugs);
  expect(Object.keys(t.context.data.testSuper).sort()).toEqual([
    'drunkyDrunkerson',
    'onlyPluginOne',
    'pluginAll',
    'pluginOneTwo',
  ]);
});
