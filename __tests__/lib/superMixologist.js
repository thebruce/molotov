const Molotov = require('../../lib/molotov');
const SuperMixologist = require('../../lib/superMixologist');
const { MolotovError } = require('../../lib/molotovError');
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

const configOverrides = {
  testMolotovImplementer: {
    molotovPlugins: {
      testSuper: {
        pluginAll: [
          'mixinOne',
          'mixinTwo',
        ],
        pluginOneThree: [
          'mixinOne',
          'mixinThree',
        ],
      },
    },
  },
};

const mixins = require('./../helpers/mixins');
const supers = require('./../helpers/supers');
const cocktailClass = require('./../helpers/cocktailHelper');

const molotov = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides, [cocktailClass]);

let tmpMocks = [];

describe('Super Mixologist basic', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Super Mixologist Constructor tests', () => {
    expect.assertions(3);
    const superMixologist = new SuperMixologist(molotov);
    expect(superMixologist.getType()).toBe('Supers');
    expect(superMixologist.getTarget()).toBe('supersNameSpace');
    expect(superMixologist.molotov).toBeInstanceOf(Molotov);
  });
});

describe('Super Mixologist resolve', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Super Mixologist fetchOverrides tests', () => {
    expect.assertions(1);
    const superMixologist = new SuperMixologist(_.cloneDeep(molotov));
    expect(superMixologist.fetchOverrides()).toMatchSnapshot();
  });
});

describe('Super Mixologist resolve', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Super Mixologist resolve tests', () => {
    expect.assertions(1);
    const superMixologist = new SuperMixologist(_.cloneDeep(molotov));
    expect(superMixologist.resolve()).toMatchSnapshot();
  });
});

describe('Super Mixologist mixCocktails Edge Cases', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Super Mixologist resolve no cocktails tests', () => {
    expect.assertions(1);
    const molotov2  = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides);
    const superMixologist = new SuperMixologist(_.cloneDeep(molotov2));
    expect(superMixologist.resolve()).toMatchSnapshot();
  });
  test('Super Mixologist resolve cocktail not filled with cocktails', () => {
    expect.assertions(1);
    const molotov2  = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides, ['tubs']);
    const superMixologist = new SuperMixologist(_.cloneDeep(molotov2));
    expect(superMixologist.resolve()).toMatchSnapshot();
  });
});
describe('Super Mixologist mixCocktails Edge Cases2', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Super Mixologist resolve cocktail throws when cocktail supers object and config do not match', () => {
    expect.assertions(1);
    const cocktailConfig = cocktailClass.getCocktailConfig();
    cocktailConfig.testMolotovImplementer.supersNameSpace.gumby = 'notAtAllAKey';
    cocktailClass.setCocktailConfig(cocktailConfig);
    const molotov2  = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides, [cocktailClass]);
    const superMixologist = new SuperMixologist(_.cloneDeep(molotov2));
    superMixologist.fetchOverrides();
    expect(() => superMixologist.mixCocktails()).toThrow(MolotovError);
  });
});