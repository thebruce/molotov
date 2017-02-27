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

// Need to mock a molotov providing module to pass along to cocktail.
// As cocktail would be overriding that module.
const Molotov = require('../molotov');

const molotovPlugins = requireDirectory(module, './helpers/plugins');
const molotovSupers = {
  testSuper: require('./helpers/supers/testSuper')
};

const molotov = new Molotov('./test/helpers/', 'testPackage', molotovSupers, molotovPlugins);

// Now require cocktail and its classes.
const Cocktail = require('../cocktail');

const cocktailPlugins = requireDirectory(module, './helpers/cocktailPlugins');
const cocktailSupers = requireDirectory(module, './helpers/cocktailPlugins');

// Test for bad plugin type rejection.
test('cocktailNoDefinitions', (t) => {
  t.throws(() => {
      const cocktail = new Cocktail(molotov, '', cocktailSupers, cocktailPlugins);
  });
});