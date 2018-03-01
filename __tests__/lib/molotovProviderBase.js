const MolotovProviderBase = require('../../lib/molotovProviderBase')

describe('MolotovProviderBase', () => {
  test('can construct', () => {
    const mpb = new MolotovProviderBase('molotov', 'test-type', 'target-type');
    expect(mpb.type).toBe('test-type');
    expect(mpb.target).toBe('target-type');
    expect(mpb.molotov).toBe('molotov');
  });

  test('setType()', () => {
    const mpb = new MolotovProviderBase('molotov', 'test-type', 'target-type');
    mpb.setType('new-type');
    expect(mpb.type).toBe('new-type');
  });

  test('getType()', () => {
    const mpb = new MolotovProviderBase('molotov', 'test-type', 'target-type');
    expect(mpb.getType()).toBe('test-type');
  });

  test('mergeConfig()', () => {
    const molotov = {
      getMolotovConfig: jest.fn().mockReturnValue({
        test: {
          'target-type': {
            config: true
          }
        }
      }),
      getConfigOverrides: jest.fn().mockReturnValue({
        test: {
          'target-type': {
            overrides: true
          }
        }
      }),
      getNameSpace: jest.fn().mockReturnValue('test'),
      setMolotovConfig: jest.fn(),
    };
    const expected = {
      config: true,
      overrides: true,
    };
    const mpb = new MolotovProviderBase(molotov, 'test-type', 'target-type');
    expect(mpb.mergeConfig()).toEqual(expected);
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
      molotov.getMolotovConfig.mockReturnValue({});
      const mpb = new MolotovProviderBase(molotov, 'test-type', 'target-type');
      expect(mpb.validateMolotovConfig()).toBe(false);
    });

    test('handles non-object constructor', () => {
      const junk = {};
      junk.constructor = () => {};
      molotov.getMolotovConfig.mockReturnValue(junk);
      const mpb = new MolotovProviderBase(molotov, 'test-type', 'target-type');
      expect(mpb.validateMolotovConfig()).toBe(false);
    });

    test('handles missing superNameSpacePaths', () => {
      molotov.getNameSpace.mockReturnValue('test');
      molotov.getMolotovConfig.mockReturnValue({ test: {} });
      const mpb = new MolotovProviderBase(molotov, 'test-type', 'target-type');
      expect(mpb.validateMolotovConfig()).toBe(false);
    });

    test('handles missing target', () => {
      molotov.getNameSpace.mockReturnValue('test');
      molotov.getMolotovConfig.mockReturnValue({ test: {
        superNameSpacePaths: true,
      } });
      const mpb = new MolotovProviderBase(molotov, 'test-type', 'target-type');
      expect(mpb.validateMolotovConfig()).toBe(false);
    });

    test('can validate', () => {
      molotov.getNameSpace.mockReturnValue('test');
      molotov.getMolotovConfig.mockReturnValue({ test: {
        superNameSpacePaths: true,
        'target-type': true,
      } });
      const mpb = new MolotovProviderBase(molotov, 'test-type', 'target-type');
      expect(mpb.validateMolotovConfig()).toBe(true);
    });
  })
})
