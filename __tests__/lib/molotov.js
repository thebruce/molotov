const Molotov = require('../../lib/molotov');
const { MolotovError } = require('../../lib/molotovError');

const molotovConfig = {
  testMolotovImplementer: {
    supersNameSpace: {
      testSuper: 'testSuper'
    },
    molotovPlugins: {
      testSuper: {
        onlyPluginOne: [
          'pluginOne',
        ],
        pluginAll: [
          'pluginOne',
          'pluginTwo',
          'pluginThree',
        ],
        pluginOneTwo: [
          'pluginOne',
          'pluginTwo',
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
          'pluginOne',
          'pluginTwo',
        ],
        pluginOneThree: [
          'pluginOne',
          'pluginThree',
        ],
      },
    },
  },
};

const mixins = require('./../helpers/mixins');
const supers = require('./../helpers/supers');
const cocktailClass = require('./../helpers/cocktailHelper');

let tmpMocks = [];

describe('Molotov Basic tests', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Molotov constructor', () => {
    expect.assertions(7);
    const molotov = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides, [cocktailClass]);
    molotov.setPlugins({ plugins: 'yay' });
    expect(molotov.getNameSpace()).toEqual('testMolotovImplementer');
    expect(molotov.getMixins()).toMatchSnapshot();
    expect(molotov.getMolotovConfig()).toMatchSnapshot();
    expect(molotov.getPlugins()).toEqual({ plugins: 'yay' });
    expect(molotov.getSupers()).toMatchSnapshot();
    expect(molotov.getConfigOverrides()).toMatchSnapshot();
    expect(molotov.getCocktails()).toMatchSnapshot();
  });
});

describe('Molotov Constructor Errors', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Bad config', () => {
    expect.assertions(1);
    expect(() => new Molotov(null, 'testMolotovImplementer', supers, mixins, configOverrides, [cocktailClass])).toThrowError(MolotovError);
  });
  test('Config must not be string', () => {
    expect.assertions(1);
    expect(() => new Molotov('string', 'testMolotovImplementer', supers, mixins, configOverrides, [cocktailClass])).toThrowError(MolotovError);
  });
  test('Supers must be an object', () => {
    expect.assertions(1);
    expect(() => new Molotov(molotovConfig, 'testMolotovImplementer', 'supers', mixins, configOverrides, [cocktailClass])).toThrowError(MolotovError);
  });
  test('Mixins must have super keys', () => {
    expect.assertions(1);
    expect(() => new Molotov(molotovConfig, 'testMolotovImplementer', supers, {}, configOverrides, [cocktailClass])).toThrowError(MolotovError);
  });
  test('Mixins must be objects', () => {
    expect.assertions(1);
    expect(() => new Molotov(molotovConfig, 'testMolotovImplementer', supers, 'mixins', configOverrides, [cocktailClass])).toThrowError(MolotovError);
  });
  test('ConfigOverrides must be objects', () => {
    expect.assertions(1);
    expect(() => new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, 'configOverrides', [cocktailClass])).toThrowError(MolotovError);
  });
  test('CocktailArray must be array', () => {
    expect.assertions(1);
    expect(() => new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides, 'cocktail')).toThrowError(MolotovError);
  });
  test('Bad Molotov config throws an error', () => {
    expect.assertions(1);
    expect(() => new Molotov({nob: 'nope'}, 'testMolotovImplementer', supers, mixins, configOverrides, 'cocktail')).toThrowError(MolotovError);
  });
});
