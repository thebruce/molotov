// @flow

import type molotov from './molotov';

import type {
  molotovConfig,
  overrideConfig,
  pluginsList,
  ProviderBase,
  supersNameSpace,
} from './types/molotov';

// User overrides are passed in targeted to a hierarchical namespace.
const _ = require('lodash');
const validator = require('./validateConfig');

module.exports = class MolotovProviderBase<T: string>
  implements ProviderBase<T> {
  target: T;
  molotov: molotov;
  type: string;
  /**
   * Create an instance of the Polttopuloo class. This class
   *  is used for mixing plugins.
   *
   * @param {molotov} molotovInstance
   *   A molotov configuration object.
   * @param {string} type
   *   A type of molotovProvider class.
   * @param {target} targetType
   *   The target for this molotov class.
   * @returns {void}
   */
  constructor(molotovInstance: molotov, type: string, targetType: T): void {
    // eslint-disable-line max-len
    this.setType(type);
    this.setTarget(targetType);
    this.setMolotov(molotovInstance);
  }

  /**
   * setType
   *
   * @param {string} type
   *   A Type i.e. Supers, or Plugins
   * @returns {void}
   */
  setType(type: string): void {
    this.type = type;
  }

  /**
   * getType
   *
   * @returns {string}
   *   returns a dynamic requires type i.e. Supers or Plugins.
   */
  getType(): string {
    return this.type;
  }

  /**
   * set Target
   *
   * @param {target} targetType
   *   A target namespace.
   * @returns {void}
   */
  setTarget(targetType: T): void {
    this.target = targetType;
  }

  /**
   * getTarget()
   *   Gets the namesapce target for this molotov class.
   *
   * @returns {target}
   *   The nameSpace target.
   */
  getTarget(): T {
    return this.target;
  }

  /**
   * mergeConfig
   * @returns {molotovConfig}
   *   A merged configuration object.
   */
  fetchOverrides(): molotovConfig {
    // get config for target
    // get any overridden config from overrides.
    const overrides: pluginsList | supersNameSpace = _.get(
      this.getMolotov().getConfigOverrides()[this.getMolotov().getNameSpace()],
      `${this.getTarget()}`,
      {}
    );
    return this.mergeConfig(
      this.getMolotov().getMolotovConfig(),
      this.createPartialConfig(overrides)
    ); // eslint-disable-line max-len
  }

  /**
   * mergeConfig
   * @param {molotovConfig} config
   *   A molotov configuration object.
   * @param {overrideConfig} overrides
   *   A config override object.
   *
   * @returns {molotovConfig}
   *   A merged configuration object.
   */
  mergeConfig(config: molotovConfig, overrides: overrideConfig): molotovConfig {
    // Bring in any dynamic or user provided overrides.
    const merged = _.merge({}, config, overrides);
    this.getMolotov().setMolotovConfig(merged);
    this.validateMolotovConfig();

    return merged;
  }

  /**
   * Creates a partial config.
   *
   * @param {(pluginsList | supersNameSpace)} configPart
   *   A config part.
   * @returns {overrideConfig}
   *   Returns a partial config object.
   */
  createPartialConfig(
    configPart: pluginsList | supersNameSpace
  ): overrideConfig {
    return _.set(
      {},
      [this.molotov.getNameSpace(), this.getTarget()],
      configPart
    );
  }

  /**
   * validateMolotovConfig()
   *   Validates that our molotovConfig is legit.
   *
   * @returns {boolean}
   *   True if we have valid config.
   */
  validateMolotovConfig(): void {
    validator(this.molotov.getMolotovConfig());
  }

  /**
   * Sets molotov
   *
   * @param {molotov} molotovClass
   *   Pass in a molotov calss to set.
   * @returns {void}
   */
  setMolotov(molotovClass: molotov): void {
    this.molotov = molotovClass;
  }

  /**
   * Gets molotov.
   *
   * @returns {molotov}
   *   Returns the molotov class.
   */
  getMolotov(): molotov {
    return this.molotov;
  }
};
