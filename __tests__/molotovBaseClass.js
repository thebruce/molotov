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

test('validateMolotovSettings', async () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  expect(t.context.data).toBe(true);
});

test('molotovConfigDoesntExist', async () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/baba', type, target);
  await expect(molotovProviderBase.setMolotovSettings()).toThrow();
});

test('molotovConfigNoPath', async () => {
  await expect(() => {
    const testy = new MolotovProviderBase(undefined, type, target); // eslint-disable-line no-unused-vars
  }).toThrow();
});

test('validateMolotovSettingsFalse', async () => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovOne',
    type,
    target,
    config
  );
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  expect(t.context.data).toBe(false);
});

test('mergeConfig', () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setSupers({superKeyName: 'thingOne'});
  molotovProviderBase.setOverrides({superKeyName: 'thingTwo'});
  t.context.data = molotovProviderBase.mergeConfig('Supers');
  expect(t.context.data).toEqual({superKeyName: 'thingTwo'});
});

test('validateMolotovSettingsFalseAgain', async () => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovTwo',
    type,
    target,
    config);
  t.context.data = await molotovProviderBase.validateMolotovSettings('supersNameSpacePaths');
  expect(t.context.data).toBe(false);
});

test('getSupersHasSupers', () => {
  const molotovProviderBase = new MolotovProviderBase(
    './test/helpers/fakeMolotovTwo',
    type,
    target,
    config
  );
  molotovProviderBase.setSupers({superKeyName: 'thing'});
  t.context.data = molotovProviderBase.getSupers();
  expect(t.context.data).toEqual({superKeyName: 'thing'});
});

test('setOverrides', async () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setOverrides({superKeyName: 'thing'});
  t.context.data = await molotovProviderBase.getOverrides();
  expect(t.context.data).toEqual({superKeyName: 'thing'});
});

test('getSupers', () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setSupers('test');
  t.context.data = molotovProviderBase.getSupers();
  expect(t.context.data).toBe('test');
});

test('getTraceIndex', () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  t.context.data = molotovProviderBase.getTraceIndex(2);
  expect(t.context.data).toBe(1);
});

test('getConfig', () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setConfig('test');
  t.context.data = molotovProviderBase.getConfig();
  expect(t.context.data).toBe('test');
});

test('setMolotovNameSpace', () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  molotovProviderBase.setMolotovNameSpace('test');
  t.context.data = molotovProviderBase.getMolotovNameSpace();
  expect(t.context.data).toBe('test');
});

test('getTraceIndexProvide0', () => {
  const molotovProviderBase = new MolotovProviderBase('./test/helpers/', type, target, config);
  t.context.data = molotovProviderBase.getTraceIndex(0);
  expect(t.context.data).toBe(0);
});
