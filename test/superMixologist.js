import test from 'ava';

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// set up test config dirs.
const config = {
  testPackage: {
    testSuper: {
      supersOverride: '/test/helpers/testSuperOverride'
    }
  }
};

const SuperMixologist = require('../superMixologist');

test('dynamicRequires', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/', '', config);
  superMixologist.overridesFetched = true;
  t.context.data = await superMixologist.dynamicRequires();
  t.deepEqual(Object.keys(t.context.data), ['testSuper']);
});

test('dynamicRequiresError', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovOne', '', config);
  superMixologist.overridesFetched = true;
  await t.throws(
    superMixologist.dynamicRequires()
  );
});

test('fetchOverrides', async (t) => {  // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers/', '', config);
  await superMixologist.dynamicRequires()
    .then(() => {
      superMixologist.setConfig({
        testPackage: {
          testSuper: {
            supersOverride: '/helpers/testSuperOverride'
          },
          molotov: {
            cocktailPluginLoaders: [
              'path/to/mixinStylePluginLoader/implementing/cocktailClass',
              'anotherPath/to/mixinStylePluginLoader/implementing/cocktailClass/lastInOverrides'
            ]
          }
        }
      });
      return superMixologist.fetchOverrides();
    })
    .then(result => t.snapshot(result));
});

test('resolve', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/', '', config);
  t.context.data = await superMixologist.resolve();
  t.deepEqual(
    t.context.data.testSuper.name,
    'testSuperOverride',
    'Resolve Supers is not functioning as expected.');
});


test('resolve 2', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/', '');
  t.context.data = await superMixologist.resolve();
  t.deepEqual(
    t.context.data.testSuper.name,
    'testSuper',
    'Resolve Supers is not functioning as expected.');
});

