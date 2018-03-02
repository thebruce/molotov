const { MolotovError } = require('../../lib/molotovError');
const mixinPluginMaker = require('../../lib/mixinPluginMaker');
const _ = require('lodash');

const molotovConfig = {
  testMolotovImplementer: {
    supersNameSpace: {
      testSuper: 'testSuper'
    },
    molotovPlugins: {
      testSuper: {
        onlyPluginOne: [
          'mixinOne',
        ],
        pluginAll: [
          'mixinOne',
          'mixinTwo',
          'mixinThree',
        ],
        pluginOneTwo: [
          'mixinOne',
          'mixinTwo',
        ],
      },
    },
  },
};

const mixins = require('./../helpers/mixins');
const supers = require('./../helpers/supers');

let tmpMocks = [];

describe('MixinPluginMaker', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Mixin Plugin Maker', () => {
    expect.assertions(1);
    expect(mixinPluginMaker(molotovConfig.testMolotovImplementer.molotovPlugins, mixins, supers))
      .toMatchSnapshot();
  });


  test('Supers in pluginDef that is not in supers classes', () => {
    expect.assertions(1);
    const molotovConfig1 = _.cloneDeep(molotovConfig);
    _.set(
      molotovConfig1,
      'testMolotovImplementer.molotovPlugins.superNameSpaceWithouCorrespondingSuperClass',
      molotovConfig1.testMolotovImplementer.molotovPlugins.testSuper
    );
    expect(() => mixinPluginMaker(molotovConfig1.testMolotovImplementer.molotovPlugins, mixins, supers))
      .toThrowError(MolotovError);
  });

  test('Mixin used in plugins definition is not in mixins classes.', () => {
    expect.assertions(1);
    _.set(
      molotovConfig,
      'testMolotovImplementer.molotovPlugins.testSuper.onlyPluginOne',
      'mixinThatIsNotInMixinClassesObject'
    );
    expect(() => mixinPluginMaker(molotovConfig.testMolotovImplementer.molotovPlugins, mixins, supers))
      .toThrowError(MolotovError);
  });
});
