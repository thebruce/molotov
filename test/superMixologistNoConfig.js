import test from 'ava';

const SuperMixologist = require('../superMixologist');

// Tests for if the user is not using the config module and provides no config.
test('setOverrides', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/');
  superMixologist.setOverrides({superKeyName: 'thing'});
  t.context.data = await superMixologist.getOverrides();
  t.deepEqual(t.context.data, {superKeyName: 'thing'});
});