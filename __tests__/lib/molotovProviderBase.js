const MolotovProviderBase = require('../../lib/molotovProviderBase')

describe('MolotovProviderBase', () => {
  test('can construct', () => {
    const mpb = new MolotovProviderBase('molotov', 'Supers', 'supersNameSpace');
    expect(mpb.target).toBe('supersNameSpace');
    expect(mpb.type).toBe('Supers');
    expect(mpb.molotov).toBe('molotov');
  });

  test('setType()', () => {
    const mpb = new MolotovProviderBase('molotov', 'Supers', 'supersNameSpace');
    mpb.setType('Plugins');
    expect(mpb.type).toBe('Plugins');
  });

  test('getType()', () => {
    const mpb = new MolotovProviderBase('molotov', 'Supers', 'supersNameSpace');
    expect(mpb.getType()).toBe('Supers');
  });

  test('fetchOverrides()', () => {
    const molotov = {
      getMolotovConfig: jest.fn().mockReturnValue({
        test: {
          'supersNameSpace': {
            superName: 'superkey'
          },
          'molotovPlugins': {
            supersNameSpace: {
              pluginOne: [
                'mixinOne'
              ]
            }
          }
        }
      }),
      getConfigOverrides: jest.fn().mockReturnValue({
        test: {
          'supersNameSpace': {
            superName: 'superkey'
          },
          'molotovPlugins': {
            supersNameSpace: {
              pluginOne: [
                'mixinOne',
                'mixinTwo'
              ]
            }
          }
        }
      }),
      getNameSpace: jest.fn().mockReturnValue('test'),
      setMolotovConfig: jest.fn(),
    };
    const expected = {
      test: {
        'supersNameSpace': {
          superName: 'superkey'
        },
        'molotovPlugins': {
          supersNameSpace: {
            pluginOne: [
              'mixinOne'
            ]
          }
        }
      }
    };
    const mpb = new MolotovProviderBase(molotov, 'Supers', 'supersNameSpace');
    expect(mpb.fetchOverrides()).toEqual(expected);
    expect(molotov.getMolotovConfig).toHaveBeenCalled();
    expect(molotov.getNameSpace).toHaveBeenCalledTimes(2);
    expect(molotov.getConfigOverrides).toHaveBeenCalled();
    expect(molotov.setMolotovConfig).toHaveBeenCalledWith(expected);
  });

  describe('validateMolotovConfig()', () => {
    let molotov;

    beforeEach(() => {
      molotov = {
        getMolotovConfig: jest.fn(),
        getConfigOverrides: jest.fn(),
        getNameSpace: jest.fn(),
        setMolotovConfig: jest.fn(),
      };
    });

    test('handles no config', () => {
      expect.assertions(1);
      molotov.getMolotovConfig.mockImplementation(() => {});
      const mpb = new MolotovProviderBase(molotov, 'Supers', 'supersNameSpace');
      mpb.molotovConfig = {};
      expect(() => mpb.validateMolotovConfig()).toThrowError();
    });

    test('handles non-object constructor', () => {
      expect.assertions(1);
      const junk = {};
      junk.constructor = () => {};
      molotov.getMolotovConfig.mockImplementation(() => junk);
      const mpb = new MolotovProviderBase(molotov, 'Supers', 'supersNameSpace');
      expect(() => mpb.validateMolotovConfig()).toThrowError();
    });

    test('handles missing superNameSpacePaths', () => {
      expect.assertions(1);
      molotov.getNameSpace.mockReturnValue('test');
      molotov.getMolotovConfig.mockImplementation(() => { test: {} });
      const mpb = new MolotovProviderBase(molotov, 'Supers', 'supersNameSpace');
      expect(() => mpb.validateMolotovConfig()).toThrowError();
    });

    test('handles missing target', () => {
      expect.assertions(1);
      molotov.getNameSpace.mockReturnValue('test');
      molotov.getMolotovConfig.mockImplementation(() => {  return { test: {
        supersNameSpace: true,
      } }});
      const mpb = new MolotovProviderBase(molotov, 'Supers', 'supersNameSpace');
      expect(() => mpb.validateMolotovConfig()).toThrowError();
    });
  })
})
