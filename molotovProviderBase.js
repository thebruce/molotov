'use strict';

/**
 * This class is a base class with shared methods for molotovClasses.
 */

// Prevent config warnings if this module is the only use of config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
// User overrides are stored in config.
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const config = require('config');

const molotovProviderBase = class {
  constructor(molotovConfigpath) {
    this.molotovNameSpace = [];
    this.setMolotovSettingsPath(molotovConfigpath);

    this.setConfig({});

    if (config.util.getConfigSources().length) {
      this.setConfig(config);
    }
  }

  /**
   * sets the Config that molotov will read.
   *
   * @param {obj} userConfig
   */
  setConfig(userConfig) {
    this.config = userConfig;
  }

  /**
   * getConfig
   *   Returns this.config.
   * @returns {obj}
   */
  getConfig() {
    return this.config;
  }

  /**
   * mergeConfig
   *
   * @returns {Promise.obj}
   *   A object bearing the molotov super classes keyed by super name space
   *    with any user provided config overrides of those supers.
   */
  mergeConfig(mergeTarget) {
    const results = this[`get${mergeTarget}`]();
    const tmpConfig = Object.assign(_.cloneDeep(results), this.getOverrides());
    this[`set${mergeTarget}`](tmpConfig);
    return tmpConfig;
  }

  /**
   * validateMolotovSettings()
   *   Validates and creates Molotov settings.
   *
   * @returns {Promise.boolean}
   */
  validateMolotovSettings(settingsAttribute) {
    // First part of validating molotov is that the file exists.
    const molotovSetPromise = this.setMolotovSettings();
    // Now check to see that we have what we need to do our work here.
    return molotovSetPromise.then(() => {
      let validator = false;
      const molotov = this.getMolotovSettings();

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
  getMolotovNameSpace() {
    return this.molotovNameSpace;
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

  // eslint-disable-next-line class-methods-use-this
  getTraceIndex(index) {
    if (index > 0) {
      return index - 1;
    }
    return 0;
  }
};

module.exports = molotovProviderBase;
