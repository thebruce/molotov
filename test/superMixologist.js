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

test('getSupersHasSupers', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovTwo');
  superMixologist.setSupers({superKeyName: 'thing'});
  t.context.data = await superMixologist.getSupers();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});

test('requireSupers', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  t.context.data = await superMixologist.requireSupers();
  t.deepEqual(Object.keys(t.context.data), ['testSuper']);
});

test('requireSupersError', (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/fakeMolotovOne');
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

test('mergeConfig', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.setSupers({superKeyName: 'thingOne'});
  superMixologist.setOverrides({superKeyName: 'thingTwo'});
  t.context.data = await superMixologist.mergeConfig();
  t.deepEqual(t.context.data, {superKeyName: 'thingTwo'});
});

test('fetchOverrides', t => new Promise((resolve) => {  // eslint-disable-line no-unused-vars
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.requireSupers()
    .then(() => superMixologist.fetchOverrides())
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


test('getSupers', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  t.context.data = await superMixologist.getSupers();
  t.deepEqual(
    t.context.data.testSuper.name,
    'testSuperOverride',
    'Resolve Supers is not functioning as expected.');
});
