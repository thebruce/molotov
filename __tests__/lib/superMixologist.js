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