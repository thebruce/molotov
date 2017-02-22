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


test('validateMolotovSettings', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  t.context.data = await superMixologist.validateMolotovSettings();
  t.true(t.context.data);
});

test('molotovConfigDoesntExist', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/baba');
  t.throws(
    superMixologist.setMolotovSettings()
  );
});

test('validateMolotovSettingsFalse', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovOne');
  t.context.data = await superMixologist.validateMolotovSettings();
  t.false(t.context.data);
});

test('validateMolotovSettingsFalseAgain', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovTwo');
  t.context.data = await superMixologist.validateMolotovSettings();
  t.false(t.context.data);
});

test('getSupersHasSupers', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovTwo');
  superMixologist.setSupers({superKeyName: 'thing'});

  t.context.data = superMixologist.getSupers();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});

test('requireSupers', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.overridesFetched = true;
  t.context.data = await superMixologist.requireSupers();
  t.deepEqual(Object.keys(t.context.data), ['testSuper']);
});

test('requireSupersError', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovOne');
  superMixologist.overridesFetched = true;
  t.throws(
    superMixologist.requireSupers()
  );
});

test('setOverrides', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.setOverrides({superKeyName: 'thing'});
  t.context.data = await superMixologist.getOverrides();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});

test('mergeConfig', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.setSupers({superKeyName: 'thingOne'});
  superMixologist.setOverrides({superKeyName: 'thingTwo'});
  t.context.data = superMixologist.mergeConfig();
  t.deepEqual(t.context.data, {superKeyName: 'thingTwo'});
});

test('fetchOverrides', t => new Promise((resolve) => {  // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.requireSupers()
    .then(() => {
      superMixologist.setConfig({
        testPackage: {
          testSuper: {
            superOverride: '/helpers/testSuperOverride'
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

test('resolveSupers', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  t.context.data = await superMixologist.resolveSupers();
  t.deepEqual(
    t.context.data.testSuper.name,
    'testSuperOverride',
    'Resolve Supers is not functioning as expected.');
});


test('getSupers', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.setSupers('test');
  t.context.data = superMixologist.getSupers();
  t.is(
    t.context.data,
    'test',
    'Resolve Supers is not functioning as expected.');
});


test('getTraceIndex', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  t.context.data = superMixologist.getTraceIndex(2);
  t.is(
    t.context.data,
    1,
    'Get Trace Index is not functioning as expected.');
});
