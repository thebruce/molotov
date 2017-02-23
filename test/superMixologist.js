import test from 'ava';

const path = require('path');
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// set up test config dirs.
process.env.NODE_CONFIG_DIR = path.join(__dirname, '/helpers', 'configTests', 'one');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars
const SuperMixologist = require('../superMixologist');

test('dynamicRequires', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.overridesFetched = true;
  t.context.data = await superMixologist.dynamicRequires();
  t.deepEqual(Object.keys(t.context.data), ['testSuper']);
});

test('dynamicRequiresError', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovOne');
  superMixologist.overridesFetched = true;
  t.throws(
    superMixologist.dynamicRequires()
  );
});

test('fetchOverrides', t => new Promise((resolve) => {  // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.dynamicRequires()
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
    .then((result) => {
      resolve(result);
    });
}));

test('resolve', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  t.context.data = await superMixologist.resolve();
  t.deepEqual(
    t.context.data.testSuper.name,
    'testSuperOverride',
    'Resolve Supers is not functioning as expected.');
});
