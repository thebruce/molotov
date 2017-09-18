import test from 'ava';

const path = require('path');
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// Need to set up a different fake config with no overrides for coverage.
// This config has no super Overrides.
const config = {
  testPackage: {
    testSuper: {
    },
    molotov: {
      cocktailPluginLoaders: [
        'badpath'
      ]
    }
  }
};
const SuperMixologist = require('../superMixologist');

test('fetchOverrides', async (t) => {  // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers', '', config);
  superMixologist.overridesFetched = true;
  await superMixologist.dynamicRequires()
    .then(() => superMixologist.fetchOverrides())
    .then((result) => {
      t.snapshot(result);
    });
});
