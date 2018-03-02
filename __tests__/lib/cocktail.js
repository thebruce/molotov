const cocktailHelper = require('../helpers/cocktailHelper');
const Cocktail = require('../../lib/cocktail');
const { MolotovError } = require('../../lib/molotovError');
const supers = require('../helpers/supers');
const mixins = require('../helpers/mixins');
const cocktailConfig = {
  testMolotovImplementer: {
    supersNameSpace: {
      testSuper: 'testSuper'
    },
    molotovPlugins: {
      testSuper: {
        onlyPluginOne: [
          'pluginOne',
        ],
        pluginOneTwo: [
          'pluginOne',
          'pluginTwo',
          'pluginFour',
        ],
        pluginAll: [
          'pluginFour',
        ],
      },
    },
  },
};

let tmpMocks = [];

describe('Cocktail Basic tests', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Cocktail constructor in action', () => {
    expect.assertions(3);
    expect(cocktailHelper.getCocktailSupers()).toMatchSnapshot();
    expect(cocktailHelper.getCocktailMixins()).toMatchSnapshot();
    expect(cocktailHelper.getCocktailConfig()).toMatchSnapshot();
  });
});

describe('Cocktail Constructor Errors', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Bad config', () => {
    expect.assertions(3);
    expect(() => new Cocktail(null)).toThrowError(MolotovError);
    expect(() => new Cocktail({})).toThrowError(MolotovError);
    expect(() => new Cocktail('')).toThrowError(MolotovError);
  });
});

describe('Cocktail Constructor empty super', () => {
  test('Cocktail empty super', () => {
    expect.assertions(1);
    const cocktail = new Cocktail(cocktailConfig, {}, mixins);
    expect(cocktail.getCocktailSupers()).toBeUndefined();
  });
});

describe('Cocktail Constructor empty mixins', () => {
  test('Cocktail empty mixins', () => {
    expect.assertions(1);
    const cocktail = new Cocktail(cocktailConfig, supers, {});
    expect(cocktail.getCocktailMixins()).toBeUndefined();
  });
});