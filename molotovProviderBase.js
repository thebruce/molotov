'use strict';

/**
 * This class is a base class with shared methods for molotovClasses.
 */

// User overrides are passed in targeted to a hierarchical namespace.
const _ = require('lodash');

const molotovProviderBase = class {
  constructor(molotovConfig, type, target, overrides = {}, cocktails = []) {
    this.setType(type);
    this.setTarget(target);
    this.molotovNameSpace = [];
    this.setMolotovConfig(molotovConfig);
    this.setOverrides(_.get(overrides, this.getTarget(), {}));
    this.setCocktails(cocktails);
  }

  setCocktails(cocktails) {
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
   * @returns {cocktails}
   */
  getCocktails() {
    return this.cocktails;
  }

  /**
   * sets the Config that molotov will read.
   *
   * @param {obj} userConfig
   */
  setMolotovConfig(userConfig) {
    if (this.validateMolotovConfig(userConfig)) {
      this.molotovConfig = userConfig;
    }
  }

  /**
   * getConfig
   *   Returns this.config.
   * @returns {obj}
   */
  getMolotovConfig() {
    return this.molotovConfig;
  }

  /**
   * mergeConfig
   *
   * @returns {object}
   *   A merged configuration object.
   */
  mergeConfig(mergeTarget) {
    const results = this[`get${mergeTarget}`]();
    const tmpConfig = _.merge(results, this.getOverrides());
    this[`set${mergeTarget}`](tmpConfig);
    return tmpConfig;
  }

  /**
   * validateMolotovSettings()
   *   validates molotov config.
   *
   * @returns {boolean}
   */
  validateMolotovConfig(settingsAttribute) {
    // Now check to see that we have what we need to do our work here.
    let validator = false;
    const molotov = this.getMolotovConfig();

    if ((Object.keys(molotov).length > 0 && molotov.constructor === Object)) {
      Object.keys(molotov).forEach((key) => {
        // We must have superNameSpacePaths in atleast one of the provider
        // name spaces.
        if (
          _.has(
            molotov[key],
            `${settingsAttribute}`
          )) {
          this.setMolotovNameSpace(key);
          validator = true;
        }
      });
    }
    return validator;
  }

  /**
   * addMolotovNameSpaces
   *
   *  Add a molotovNameSpace.
   * @param {string} nameSpace
   */
  setMolotovNameSpace(nameSpace) {
    this.molotovNameSpace = nameSpace;
  }

  /**
   * getMolotovNameSpaces.
   *  returns this.molotovNameSpace for this provider.
   *
   * @returns {string}
   */
  getMolotovNameSpace() {
    return this.molotovNameSpace;
  }

  /**
   * fetchOverrides
   *   Gets target namespace override paths from config,
   *   requires and assigns them to this.overrides as well as
   *   marking a sentinel value this.overridesFetched.
   *
   * @returns {Promise.obj}
   *  Returns an object bearing promise of config overrides.
   */
  fetchOverrides() {
    const fetcher = new Promise((res) => {
      let configTemp;
      const targetConfig = _.cloneDeep(this[`get${this.getType()}`]());

      if (this.getType() === 'Plugins') {
        // For arrays we push the value to the array.
        configTemp = {};
        if (_.has(this.getConfig(), `${nameSpace}.${this.getTarget()}`)) {
          this.getConfig()[nameSpace][`${this.getTarget()}`].forEach((currentValue) => {
            // We do have an overide, we will set the path.
            const Tempers = this.getItem(currentValue);
            const tempers = new Tempers();
            _.merge(configTemp, tempers.resolve());
          }, this);
        }
      }
      else {
        // For objects we allow for namespaces.
        configTemp = {};
        Object.keys(targetConfig).forEach((currentValue) => {
          if (
            _.has(this.getConfig(),
            `${nameSpace}.${currentValue}.${this.getType().toLowerCase()}Override`
            )) {
            // eslint-disable-next-line max-len
            const override = this.getConfig()[nameSpace][currentValue][`${this.getType().toLowerCase()}Override`];
            configTemp[currentValue] = this.getItem(override);
          }
        }, this);
      }

      this.overridesFetched = true;
      this.setOverrides(configTemp);
      res(configTemp);
    });
    return fetcher.then(overriddenValues => overriddenValues);
  }

  /**
   * setOverrides
   *   Sets user config defined target namespace overrides.
   *
   * @param {object} overrides
   *   An object of user suplied overrides keyed by the target nameSpace
   *     with a value of their class.
   */
  setOverrides(overrides) {
    this.overrides = overrides;
  }

  /**
   * getOverrides
   *   Get this.overrides, user config defined target name space overrides.
   *
   * @returns {obj} this.overrides
   */
  getOverrides() {
    return this.overrides;
  }

  /**
   * setSupers
   *   set Supers on this.
   *
   * @param {obj} supers
   *   An object of super class values keyed by molotov indicated
   *    super namespaces.  EX: superNameSpace: class
   */
  setSupers(supers) {
    this.supers = supers;
  }

  /**
   * getSupers
   *
   * @returns {obj} supers
   *   An object bearing promise of super class values keyed
   *     by molotov indicated super namespaces.
   *       EX: superNameSpace: class
   */
  getSupers() {
    return this.supers;
  }

  /**
   * setType
   *
   * @param {string} type
   *   A Type i.e. Supers, or Plugins
   */
  setType(type) {
    this.type = type;
  }

  /**
   * getType
   *
   * @returns {string}
   *   returns a dynamic requires type i.e. Supers or Plugins.
   */
  getType() {
    return this.type;
  }

  /**
   * setTarget
   *
   * @param {string} target
   *   A target namespace.
   */
  setTarget(target) {
    this.target = target;
  }

  /**
   * getTarget()
   *   Gets the namesapce target for this molotov class.
   *
   * @returns {string}
   *   The nameSpace target.
   */
  getTarget() {
    return this.target;
  }

  /**
   * resolve()
   *   Takes the provided molotov config and merges
   *   (i.e. supers, or plugins) then we dynamically require them.
   *   Once we have a target item we then look for user provided overrides.
   *   We merge any overrides and return the merged object.
   *
   * @returns Promise.obj
   *   A object bearing the molotov target classes keyed by target name space
   *    with any user provided config overrides of those target name spaces.
   */
  resolve() {
    // merge up config.
    // getGetTypes
    // then call GetTypes on cocktails
    // merge down and reset thisType
    let resolver;
    if (_.has(this, this.getType().toLowerCase())) {
      // If we have our target items in 'this' scope take them
      // from target getter, i.e. getSupers();
      // After that run validate, in case it hasn't been run.
      resolver = new Promise(res => res(this[`get${this.getType()}`]()))
      .then(() => this.validateMolotovSettings(this.getTarget()));
    }

    // At this point we are ready to see if we have user provided overrides.
    const nextStep = resolver.then(() => this.fetchOverrides());

    // And finally we can return our merged config.
    return nextStep.then(() => this.mergeConfig(this.getType()));
  }
};

module.exports = molotovProviderBase;
