const MolotovProviderBase = require('../molotovProviderBase');

// Tests for if the user is not using the config module and provides no config.
test('setOverrides', async () => {
  const superMixologist = new MolotovProviderBase('./test/helpers/');
  superMixologist.setOverrides({ superKeyName: 'thing' });
  t.context.data = await superMixologist.getOverrides();
  expect(t.context.data).toEqual({ superKeyName: 'thing' });
});
