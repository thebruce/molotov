'use strict';

/**
 * This class an implementation of the abstract superMixologist class.
 * It is meant to provide a streamlined super class implementation.
 *
 * Provider modules may find it useful to extend the abstract class rather
 * than to invoke this realization for more control and explicit declarative
 * requires of super classes. But this class is fully capable of handling
 * the task.A single override super can be specified via config and is
 * demonstrated in the README.md. If overrides have been specified in config
 * we will attempt to load them in to override our default supers with them
 * for mixin construction.
 */

// Prevent config warnings if this module is the only use of config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
// User overrides are stored in config.
const config = require('config');
const tryRequire = require('try-require');
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');

// Users instantiate superMixologist.
// superMixologist = new SuperMixologist(pathToProviderModule);
// To use the new instantiated super to return this providers supers we:
// const providerSupers = superMixologist.getSupers();

const superMixologist = class {
  /**
   * constructor for the superMixologistAbstract.
   *
   * @params {string} molotovConfigpath
   *   The base path of the molotovConfig file for the provider module
   *     for these super classes.
   */
  constructor(molotovConfigpath) {
    this.molotovNameSpace = [];
    this.setMolotovSettingsPath(molotovConfigpath);
  }

  /**
   * validateMolotovSettings()
   *   Validates and creates Molotov settings.
   *
   * @returns {Promise.boolean}
   */
  validateMolotovSettings() {
    // First part of validating molotov is that the file exists.
    const molotovSetPromise = this.setMolotovSettings();
    // Now check to see that we have what we need to do our work here.
    return molotovSetPromise.then(() => {
      let validator = false;
      const molotov = this.getMolotovSettings();
      if (_.has(molotov, 'molotov.providers')) {
        Object.keys(molotov.molotov.providers).forEach((key) => {
          // We must have superNameSpacePaths in atleast one of the provider
          // name spaces.
          if (
            _.has(
              molotov.molotov.providers[key],
              'supersNameSpacePaths'
            )
            &&
            _.has(
              molotov.molotov.providers[key],
              'configNameSpace'
            )) {
            this.setMolotovNameSpace(_.get(molotov.molotov.providers[key], 'configNameSPace'));
            validator = true;
          }
        });
      }
      return validator;
    });
  }

  /**
   * setMolotovSettingsPath
   *   Sets the path to the molotov settings file.
   *
   * @param {string} molotovBasePath
   *   The base path to the molotov settings file for this provider module.
   */
  setMolotovSettingsPath(molotovBasePath) {
    this.molotovSettingsPath = path.join(molotovBasePath, '.molotov.json');
  }

  /**
   * getMolotovSettingsPath
   *   Returns the path set for the molotov settings file for this provider.
   *
   * @returns {string}
   *   The path to this provider's molotov file.
   */
  getMolotovSettingsPath() {
    return this.molotovSettingsPath;
  }

  /**
   * setMolotovSettings
   *   Sets Molotov settings from the molotov settings path.
   *
   * @returns {Promise.object}
   *   A molotov settings object.
   */
  setMolotovSettings() {
    return new Promise((res, rej) => {
      fs.readJson(this.getMolotovSettingsPath(), (err, data) => {
        if (err) {
          rej(err);
        }
        else {
          this.molotovSettings = data;
          res(true);
        }
      });
    });
  }

  /**
   * getMolotovSettings
   *   Returns the retrieved molotov settings objec.t
   *
   * @returns {obj}
   *   A molotov settings object.
   */
  getMolotovSettings() {
    return this.molotovSettings;
  }

  /**
   * addMolotovNameSpaces
   *  Add a molotovNameSpace.
   * @param string nameSpace
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
  getMolotovNameSpaces() {
    return this.molotovNameSpace;
  }


  /**
   * fetchOverrides
   *   Gets super override paths from config, requires and assigns them to
   *   this.overrides as well as marking a sentinel value
   *   this.overridesFetched.
   *
   * @returns {Promise.obj}
   *  Returns an object bearing promise of config overrides.
   */
  fetchOverrides() {
    return new Promise((res, rej) => {
      try {
        // get nameSpace from molotov.
        const nameSpace = this.getMolotvNameSpaces();
        const configTemp = {};
        // get Supers.
        const superConfig = _.cloneDeep(this.getSupers());
        // We will now look in config for any overides.
        Object.keys(superConfig).forEach((currentValue) => {
          if (_.has(config, `${nameSpace}.${currentValue}.superOverride`)) {
            // We do have an overide, we will set the path.
            const override = config[nameSpace][currentValue].superOverride;
            // Now let's try and require it.
            // eslint-disable-next-line import/no-dynamic-require
            configTemp[currentValue] = tryRequire(path.join(__dirname, override));
          }
        }, this);
        res(configTemp);
      }
      catch (error) {
        rej(error);
      }
    })
    .then((result) => {
      this.overridesFetched = true;
      this.setOverrides(result);
    });
  }

  /**
   * setOverrides
   *   Sets user config defined super overrides.
   *
   * @param {object} overrides
   *   An object of user suplied super overrides keyed by the supers nameSpace
   *     with a value of their class.
   */
  setOverrides(overrides) {
    this.overrides = overrides;
  }

  /**
   * getOverrides
   *   Get this.overrides, user config defined super overrides.x
   *
   * @returns {obj} this.overrides
   */
  getOverrides() {
    return this.overrides;
  }

  /**
   * mergeConfig
   *
   * @returns {Promise.obj}
   *   A object bearing the molotov super classes keyed by super name space
   *    with any user provided config overrides of those supers.
   */
  mergeConfig() {
    return new Promise((res) => {
      // Merge supers and overrides.
      const superTemp = _.cloneDeep(this.getSupers());
      const tmpConfig = Object.assign(superTemp, this.getOverrides());
      this.setSupers(tmpConfig);
      res(tmpConfig);
    });
  }

  /**
   * requireSupers
   *  Populates molotov provider indicated supers by requiring their classes.
   * @returns {Promise.object}
   *   An object bearing promise of super class values keyed by molotov
   *   indicated
   *    super namespaces.
   */
  requireSupers() {
    const superRequires = this.validateMolotovSettings();
    return superRequires.then(() => {
      try {
        // Get nameSpace.
        const nameSpace = this.getMolotvNameSpaces();
        const supers = {};
        // require items in this name space.
        Object.keys(
          this.getMolotovSettings().providers[nameSpace].supersNameSpacePaths
        ).forEach((key) => {
          // For each super in molotov settings attempt to require item.
          // eslint-disable-next-line import/no-dynamic-require
          supers[key] = require(
            this.getMolotovSettings().providers[nameSpace].supersNameSpacePaths[key]
          );
        });
        this.setSupers(supers);
        return supers;
      }
      catch (err) {
        throw new Error(err);
      }
    });
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
    return new Promise((res) => {
      if (_.has(this, 'supers')) {
        res(this.supers);
      }
      else {
        this.resolveSupers()
        .then(result => res(result));
      }
    });
  }

  /**
   * resolveSupers()
   *
   * @returns Promise.obj
   *   A object bearing the molotov super classes keyed by super name space
   *    with any user provided config overrides of those supers.
   */
  resolveSupers() {
    const superResolver = this.requireSupers()
    .then(() => {
      // Supers have been populated.
      const overridePromise = this.fetchOverrides();
      // Do we have overrides?
      return overridePromise.then(() => this.getOverrides());
    })
    .then(overrides => this.mergeConfig(overrides));
    // Return mergedConfig.
    return superResolver.then(mergedConfig => mergedConfig);
  }
};

module.exports = superMixologist;
