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
        'badpath',
      ],
    },
  },
};
const SuperMixologist = require('../superMixologist');

test('fetchOverrides', async () => { // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers', '', config);
  superMixologist.overridesFetched = true;
  await superMixologist.dynamicRequires()
    .then(() => superMixologist.fetchOverrides())
    .then((result) => {
      expect(result).toMatchSnapshot();
    });
});
