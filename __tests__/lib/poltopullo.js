const Molotov = require('../../lib/molotov');
const SuperMixologist = require('../../lib/superMixologist');
const Polttopullo = require('../../lib/polttopullo');
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

describe('PolttoPullo Basic', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Polttopullo Constructor tests', () => {
    expect.assertions(3);
    const superMixologist = new SuperMixologist(molotov);
    superMixologist.resolve();
    const polttopullo = new Polttopullo(superMixologist.molotov);
    expect(polttopullo.getType()).toBe('Plugins');
    expect(polttopullo.getTarget()).toBe('molotovPlugins');
    expect(polttopullo.molotov).toBeInstanceOf(Molotov);
  });
});

describe('PolttoPullo mix cocktails', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Polttopullo Constructor tests', () => {
    expect.assertions(1);
    const superMixologist = new SuperMixologist(molotov);
    superMixologist.resolve();
    const polttopullo = new Polttopullo(superMixologist.molotov);
    polttopullo.fetchOverrides();
    polttopullo.mixCocktails();
    expect(polttopullo.molotov.getMixins()).toMatchSnapshot();
  });
});


describe('PolttoPullo resolve', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Polttopullo Constructor tests', () => {
    expect.assertions(1);
    const superMixologist = new SuperMixologist(molotov);
    superMixologist.resolve();
    const polttopullo = new Polttopullo(superMixologist.molotov);
    expect(polttopullo.resolve()).toMatchSnapshot();
  });
});

describe('Polttopullo mixCocktails Edge Cases', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Polttopullo resolve with no cocktail classes no overrides.', () => {
    expect.assertions(1);
    const molotov2  = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins);
    const superMixologist = new SuperMixologist(molotov2);
    superMixologist.resolve();
    const polttopullo = new Polttopullo(superMixologist.molotov);
    expect(polttopullo.resolve()).toMatchSnapshot();
  });
  test('Super Mixologist resolve cocktail not filled with cocktails', () => {
    expect.assertions(1);
    const molotov2  = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides);
    const superMixologist = new SuperMixologist(molotov2);
    superMixologist.resolve();
    superMixologist.molotov.setCocktails(['tubs']);
    const polttopullo = new Polttopullo(superMixologist.molotov);
    expect(polttopullo.resolve()).toMatchSnapshot();
  });
});

describe('Polttopullo mixCocktails Edge Cases2', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Polttopullo resolve cocktail throws when cocktail supers object and config do not match', () => {
    expect.assertions(1);
    let cocktailConfig = cocktailClass.getCocktailConfig();
    // Set a new plugin under an existing super with a mixin that doesn't exist.
    cocktailConfig = _.set(cocktailConfig, 'testMolotovImplementer.molotovPlugins.testSuper.jalapeno',  ['notAtAllAKey']);
    cocktailClass.setCocktailConfig(cocktailConfig);
    const molotov2  = new Molotov(molotovConfig, 'testMolotovImplementer', supers, mixins, configOverrides, [cocktailClass]);
    const superMixologist = new SuperMixologist(molotov2);
    superMixologist.resolve();
    const polttopullo = new Polttopullo(superMixologist.molotov);
    polttopullo.fetchOverrides();
    expect(() => polttopullo.mixCocktails()).toThrow(MolotovError);
  });
});