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

const supers = {
  testSuper: require('./helpers/supers/testSuper')
};

test('resolveSupers', async (t) => {
  const superMixologist = new SuperMixologist('./test/helpers/', supers);
  t.context.data = await superMixologist.resolve();
  t.deepEqual(
    t.context.data.testSuper.name,
    'testSuperOverride',
    'Resolve Supers is not functioning as expected.');
});
