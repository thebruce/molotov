import test from 'ava';

const path = require('path');

const type = 'Supers';
const target = 'supersNameSpacePaths';
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// set up test config dirs.
process.env.NODE_CONFIG_DIR = path.join(__dirname, '/helpers', 'configTests', 'one');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars
const MolotovProviderBase = require('../molotovProviderBase');

test('validateMolotovSettings', async (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  t.true(t.context.data);
});

test('molotovConfigDoesntExist', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/baba', type, target);
  t.throws(
    molotovProviderBase.setMolotovSettings()
  );
});

test('validateMolotovSettingsFalse', async (t) => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovOne',
    type,
    target
  );
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  t.false(t.context.data);
});

test('mergeConfig', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  molotovProviderBase.setSupers({superKeyName: 'thingOne'});
  molotovProviderBase.setOverrides({superKeyName: 'thingTwo'});
  t.context.data = molotovProviderBase.mergeConfig('Supers');
  t.deepEqual(t.context.data, {superKeyName: 'thingTwo'});
});

test('validateMolotovSettingsFalseAgain', async (t) => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovTwo',
    type,
    target);
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  t.false(t.context.data);
});

test('getSupersHasSupers', (t) => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovTwo',
    type,
    target
  );
  molotovProviderBase.setSupers({superKeyName: 'thing'});
  t.context.data = molotovProviderBase.getSupers();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});

test('setOverrides', async (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  molotovProviderBase.setOverrides({superKeyName: 'thing'});
  t.context.data = await molotovProviderBase.getOverrides();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});

test('getSupers', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  molotovProviderBase.setSupers('test');
  t.context.data = molotovProviderBase.getSupers();
  t.is(
    t.context.data,
    'test',
    'Resolve Supers is not functioning as expected.');
});

test('getTraceIndex', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  t.context.data = molotovProviderBase.getTraceIndex(2);
  t.is(
    t.context.data,
    1,
    'Get Trace Index is not functioning as expected.');
});

test('getConfig', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  molotovProviderBase.setConfig('test');
  t.context.data = molotovProviderBase.getConfig();
  t.is(
    t.context.data,
    'test',
    'Get Config is not functioning as expected.');
});

test('setMolotovNameSpace', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  molotovProviderBase.setMolotovNameSpace('test');
  t.context.data = molotovProviderBase.getMolotovNameSpace();
  t.is(
    t.context.data,
    'test',
    'Get Molotov Name Space is not functioning as expected.');
});

test('getTraceIndexProvide0', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target);
  t.context.data = molotovProviderBase.getTraceIndex(0);
  t.is(
    t.context.data,
    0,
    'Get Trace Index is not functioning as expected.');
});
