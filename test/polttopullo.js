import test from 'ava';

const path = require('path');
const requireDirectory = require('require-directory');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// set up test config dirs.
process.env.NODE_CONFIG_DIR = path.join(__dirname, '/helpers', 'configTests', 'one');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars
const MixedDrink = require('../polttopullo');

const plugins = requireDirectory(module, './helpers/plugins');
const supers = {
  testSuper: require('./helpers/supers/testSuper')
};

test('getPlugins', async (t) => {
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
