import test from 'ava';

const type = 'Supers';
const target = 'supersNameSpacePaths';
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
const MolotovProviderBase = require('../molotovProviderBase');

test('validateMolotovSettings', async (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  t.true(t.context.data);
});

test('molotovConfigDoesntExist', async (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/baba', type, target);
  await t.throws(
    molotovProviderBase.setMolotovSettings()
  );
});

test('molotovConfigNoPath', async (t) => {
  await t.throws(() => {
    const testy = new MolotovProviderBase(undefined, type, target); // eslint-disable-line no-unused-vars
  }
  );
});

test('validateMolotovSettingsFalse', async (t) => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovOne',
    type,
    target,
    config
  );
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  t.false(t.context.data);
});

test('mergeConfig', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setSupers({superKeyName: 'thingOne'});
  molotovProviderBase.setOverrides({superKeyName: 'thingTwo'});
  t.context.data = molotovProviderBase.mergeConfig('Supers');
  t.deepEqual(t.context.data, {superKeyName: 'thingTwo'});
});

test('validateMolotovSettingsFalseAgain', async (t) => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovTwo',
    type,
    target,
    config);
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  t.false(t.context.data);
});

test('getSupersHasSupers', (t) => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovTwo',
    type,
    target,
    config
  );
  molotovProviderBase.setSupers({superKeyName: 'thing'});
  t.context.data = molotovProviderBase.getSupers();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});

test('setOverrides', async (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setOverrides({superKeyName: 'thing'});
  t.context.data = await molotovProviderBase.getOverrides();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});

test('getSupers', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setSupers('test');
  t.context.data = molotovProviderBase.getSupers();
  t.is(
    t.context.data,
    'test',
    'Resolve Supers is not functioning as expected.');
});

test('getTraceIndex', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  t.context.data = molotovProviderBase.getTraceIndex(2);
  t.is(
    t.context.data,
    1,
    'Get Trace Index is not functioning as expected.');
});

test('getConfig', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setConfig('test');
  t.context.data = molotovProviderBase.getConfig();
  t.is(
    t.context.data,
    'test',
    'Get Config is not functioning as expected.');
});

test('setMolotovNameSpace', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setMolotovNameSpace('test');
  t.context.data = molotovProviderBase.getMolotovNameSpace();
  t.is(
    t.context.data,
    'test',
    'Get Molotov Name Space is not functioning as expected.');
});

test('getTraceIndexProvide0', (t) => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  t.context.data = molotovProviderBase.getTraceIndex(0);
  t.is(
    t.context.data,
    0,
    'Get Trace Index is not functioning as expected.');
});
