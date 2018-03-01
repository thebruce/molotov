// @flow

import type {
  molotovConfig,
  overrideConfig,
  supers,
  target,
  CocktailArray,
} from './types/molotov';

// User overrides are passed in targeted to a hierarchical namespace.
const _ = require('lodash');

module.exports = class MolotovProviderBase {
  molotovConfig: molotovConfig
  molotovNameSpace: string
  target: target
  cocktails: CocktailArray
  overrides: overrideConfig
  type: string
  supers: supers
  /**
   * Create an instance of the Polttopuloo class. This class
   *  is used for mixing plugins.
   *
   * @param {molotovConfig} config
   *   A molotov configuration object.
   * @param {string} nameSpace
   *   THe namespace of your molotov implementing module.
   * @param {string} type
   *   A type of molotovProvider class.
   * @param {target} targetType
   *   The target for this molotov class.
   * @param {object} overrides
   *   An object with the exact same shape as molotovConfig but
   *     meant as a place to pass through calling modules overrides
   *       to your molotov implementing configuration. Often used for
   *         dynamically or runtime assembled plugins.
   * @param {Array<Cocktail>} cocktails
   *   An array of cocktail classes used by modules using your molotov
   *   implementing module and providing their own plugins or supers.
   *
   * @returns {void}
   */
  constructor(config: molotovConfig, nameSpace: string, type: string, targetType: target, overrides: (overrideConfig | {}), cocktails: CocktailArray): void { // eslint-disable-line max-len
    this.setType(type);
    this.setTarget(targetType);
    this.setNameSpace(nameSpace);
    this.setMolotovConfig(config);
    this.setOverrides(_.get(overrides, this.getTarget(), {}));
    this.setCocktails(cocktails);
  }

  /**
   * Sets Cocktails for this molotovProvider base.
   *
   * @param {CocktailArray} cocktails
   *   An array of Cocktail classes.
   * @returns {void}
   *  returns this.
   */
  setCocktails(cocktails: CocktailArray): void {
    this.cocktails = cocktails;
  }

  /**
   * It's martini time!
   * .---------.'---.
   * '.       :    .'
   *   '.  .:::  .'
   *     '.'::'.'
   *       '||'
   *        ||
   *        ||
   *        ||
   *    ---====---
   *
   * @returns {CocktailArray}
   *   Returns an array of cocktail classes.
   */
  getCocktails(): CocktailArray {
    return this.cocktails;
  }

  /**
   * sets the Config that molotov will read.
   *
   * @param {molotovConfig} config
   *  Molotov configu
   *
   * @returns {void}
   */
  setMolotovConfig(config: molotovConfig): void {
    this.molotovConfig = config;
  }


  /**
   * getConfig
   *   Returns this.config.
   *
   * @returns {molotovConfig}
   *   returns molotovConfig.
   */
  getMolotovConfig(): molotovConfig {
    return this.molotovConfig;
  }

  /**
   * mergeConfig
   * @param {target} mergeTarget
   *   A target.
   *
   * @returns {molotovConfig}
   *   A merged configuration object.
   */
  mergeConfig(): molotovConfig {
    // get config for target
    const config: molotovConfig = _.get(
      this.getMolotovConfig()[this.getNameSpace()],
      this.getTarget()
    );
    // get any overridden config from overrides.
    const overrides: overrideConfig = _.get(
      this.getOverrides()[this.getNameSpace()],
      this.getTarget(),
      {}
    );
    // Bring in any dynamic or user provided overrides.
    const merged = _.merge({}, config, overrides);
    this.setMolotovConfig(merged);

    return merged;
  }

  /**
   * validateMolotovConfig()
   *   Validates that our molotovConfig is legit.
   *
   * @returns {boolean}
   *   True if we have valid config.
   */
  validateMolotovConfig(): boolean {
    let validator = false;
    const mergedConfig = this.getMolotovConfig();
    // Our merged config needs to be populated.
    // Our merged config needs to atleast have supers.
    // Out merged config needs to have this class' target.
    if ((
      Object.keys(mergedConfig).length > 0 &&
      mergedConfig.constructor === Object &&
      _.has(mergedConfig[this.getNameSpace()], 'superNameSpacePaths') &&
      _.has(mergedConfig[this.getNameSpace()], `${this.getTarget()}`)
    )) {
      validator = true;
    }
    return validator;
  }

  /**
   * Sets the namespace for this molotov use.
   *
   * @param {string} nameSpace
   *   The namespace of the module implementing molotov.
   *   This will be used to interpret configuration passed
   *   in molotov config.
   *
   * @returns {void}
   */
  setNameSpace(nameSpace: string): void {
    this.molotovNameSpace = nameSpace;
  }

  /**
   * Get the namespace string for this molotov implementation.
   *
   * @returns {string}
   *   The namespace of this molotov implementation.
   */
  getNameSpace(): string {
    return this.molotovNameSpace;
  }

  /**
   * setOverrides
   *   Sets user config defined target namespace overrides.
   *
   * @param {object} overrides
   *   An object of user suplied overrides keyed by the target nameSpace
   *     with a value of their class.
   *
   * @returns {void}
   */
  setOverrides(overrides): void {
    this.overrides = overrides;
  }

  /**
   * getOverrides
   *   Get this.overrides, user config defined target name space overrides.
   *
   * @returns {overrideConfig} this.overrides
   */
  getOverrides(): overrideConfig {
    return this.overrides;
  }

  /**
   * setSupers
   *   set Supers on this.
   *
   * @param {supers} pBSupers
   *   An object of super class values keyed by molotov indicated
   *    super namespaces.  EX: superNameSpace: class
   * @returns {void}
   */
  setSupers(pBSupers: supers): void {
    this.supers = pBSupers;
  }

  /**
   * getSupers
   *
   * @returns {obj} supers
   *   An object bearing promise of super class values keyed
   *     by molotov indicated super namespaces.
   *       EX: superNameSpace: class
   */
  getSupers(): supers {
    return this.supers;
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
   * setTarget
   *
   * @param {target} targetType
   *   A target namespace.
   * @returns {void}
   */
  setTarget(targetType: target): void {
    this.target = targetType;
  }

  /**
   * getTarget()
   *   Gets the namesapce target for this molotov class.
   *
   * @returns {target}
   *   The nameSpace target.
   */
  getTarget(): target {
    return this.target;
  }

  /**
   * resolve()
   *   Takes the provided molotov config and merges
   *   (i.e. supers, or plugins) then we dynamically require them.
   *   Once we have a target item we then look for user provided overrides.
   *   We merge any overrides and return the merged object.
   *
   * @returns {void}
   *   A object bearing the molotov target classes keyed by target name space
   *    with any user provided config overrides of those target name spaces.
   */
  resolve(): void {
    // merge up config.
    this.mergeConfig();

    if (!this.validateMolotovConfig()) {
      throw new Error(`Merging molotovConfig and provided overrides has resulted in an malformed configuration for molotov implementing module ${this.getNameSpace()}`);
    }
  }
};
