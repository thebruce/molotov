import test from 'ava';

const path = require('path');
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// Need to set up a different fake config with no overrides for coverage.
// This config has no super Overrides.
process.env.NODE_CONFIG_DIR = path.join(__dirname, '/helpers', 'configTests', 'two');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars
const SuperMixologist = require('../superMixologist');


test('fetchOverrides', t => new Promise((resolve) => {  // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers');
  superMixologist.overridesFetched = true;
  superMixologist.dynamicRequires()
    .then(() => superMixologist.fetchOverrides())
    .then((result) => {
      resolve(result);
    });
}));
