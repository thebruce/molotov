import test from 'ava';

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

