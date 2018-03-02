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
    expect(polttopullo.molotov.getMixins()).toBe();
  });
});
