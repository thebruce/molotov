import test from 'ava';

const MolotovProviderBase = require('../molotovProviderBase');

// Tests for if the user is not using the config module and provides no config.
test('setOverrides', async (t) => {
  const superMixologist = new MolotovProviderBase('./test/helpers/');
  superMixologist.setOverrides({superKeyName: 'thing'});
  t.context.data = await superMixologist.getOverrides();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});
