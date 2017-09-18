import test from 'ava';

const path = require('path');
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
const config = {
  testPackage: {
    testSuper: {
      supersOverride: '/test/helpers/testSuperOverride'
    }
  }
};

const SuperMixologist = require('../superMixologist');

const supers = {
  testSuper: require('./helpers/supers/testSuper')
};

test('resolveSupers', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/', supers, config);
  t.context.data = await superMixologist.resolve();
  t.deepEqual(
    t.context.data.testSuper.name,
    'testSuperOverride',
    'Resolve Supers is not functioning as expected.');
});
