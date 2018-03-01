Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
const config = {
  testPackage: {
    testSuper: {
      supersOverride: '/test/helpers/testSuperOverride',
    },
  },
};

const SuperMixologist = require('../superMixologist');

const supers = {
  testSuper: require('./helpers/supers/testSuper'),
};

test('resolveSupers', async () => {
  const superMixologist = new SuperMixologist('./test/helpers/', supers, config);
  t.context.data = await superMixologist.resolve();
  expect(t.context.data.testSuper.name).toEqual('testSuperOverride');
});
