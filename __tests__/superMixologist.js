Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// set up test config dirs.
const config = {
  testPackage: {
    testSuper: {
      supersOverride: '/test/helpers/testSuperOverride',
    },
  },
};

const SuperMixologist = require('../superMixologist');

test('dynamicRequires', async () => {
  const superMixologist = new SuperMixologist('./test/helpers/', '', config);
  superMixologist.overridesFetched = true;
  t.context.data = await superMixologist.dynamicRequires();
  expect(Object.keys(t.context.data)).toEqual(['testSuper']);
});

test('dynamicRequiresError', async () => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovOne', '', config);
  superMixologist.overridesFetched = true;
  await expect(superMixologist.dynamicRequires()).toThrow();
});

test('fetchOverrides', async () => { // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers/', '', config);
  await superMixologist.dynamicRequires()
    .then(() => {
      superMixologist.setConfig({
        testPackage: {
          testSuper: {
            supersOverride: '/helpers/testSuperOverride',
          },
          molotov: {
            cocktailPluginLoaders: [
              'path/to/mixinStylePluginLoader/implementing/cocktailClass',
              'anotherPath/to/mixinStylePluginLoader/implementing/cocktailClass/lastInOverrides',
            ],
          },
        },
      });
      return superMixologist.fetchOverrides();
    })
    .then(result => expect(result).toMatchSnapshot());
});

test('resolve', async () => {
  const superMixologist = new SuperMixologist('./test/helpers/', '', config);
  t.context.data = await superMixologist.resolve();
  expect(t.context.data.testSuper.name).toEqual('testSuperOverride');
});


test('resolve 2', async () => {
  const superMixologist = new SuperMixologist('./test/helpers/', '');
  t.context.data = await superMixologist.resolve();
  expect(t.context.data.testSuper.name).toEqual('testSuper');
});

