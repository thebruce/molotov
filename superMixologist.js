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
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const stack = require('callsite');

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
  constructor(molotovConfigpath, supers) {
    if (typeof supers !== 'undefined') {
      this.setSupers(supers);
    }
    this.molotovNameSpace = [];
    this.setMolotovSettingsPath(molotovConfigpath);

    this.setConfig({});

    if (config.util.getConfigSources().length) {
      this.setConfig(config);
    }
  }


  setConfig(userConfig) {
    this.config = userConfig;
  }

  getConfig() {
    return this.config;
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

      if ((Object.keys(molotov).length > 0 && molotov.constructor === Object)) {
        Object.keys(molotov).forEach((key) => {
          // We must have superNameSpacePaths in atleast one of the provider
          // name spaces.
          if (
            _.has(
              molotov[key],
              'supersNameSpacePaths'
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
   * fetchOverrides
   *   Gets super override paths from config, requires and assigns them to
   *   this.overrides as well as marking a sentinel value
   *   this.overridesFetched.
   *
   * @returns {Promise.obj}
   *  Returns an object bearing promise of config overrides.
   */
  fetchOverrides() {
    const nameSpace = this.getMolotovNameSpace();
    const fetcher = new Promise((res) => {
      const configTemp = {};
      const superConfig = _.cloneDeep(this.getSupers());

      // Get overrides for declared supers name spaces.
      Object.keys(superConfig).forEach((currentValue) => {
        if (_.has(this.getConfig(), `${nameSpace}.${currentValue}.superOverride`)) {
          // We do have an overide, we will set the path.
          const override = this.getConfig()[nameSpace][currentValue].superOverride;
          // base is our resolve path to this module.
          const base = require.resolve('./');
          const stackTrace = stack().reverse();
          let traceIndex = stackTrace.findIndex(
            trace => trace.getFileName() === base
          );
          traceIndex = this.getTraceIndex(traceIndex);
          // eslint-disable-next-line import/no-dynamic-require
          configTemp[currentValue] = require(
              path.join(path.resolve(path.dirname(stackTrace[traceIndex].getFileName())),
              override
            ));
        }
      }, this);
      this.overridesFetched = true;
      this.setOverrides(configTemp);

      res(configTemp);
    });
    return fetcher.then(overriddenSupers => overriddenSupers);
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
    const results = this.getSupers();
    const tmpConfig = Object.assign(_.cloneDeep(results), this.getOverrides());
    this.setSupers(tmpConfig);
    return tmpConfig;
  }

  /**
   * requireSupers
   *  Populates molotov provider indicated supers by requiring their classes.
   *
   * @returns {Promise.object}
   *   An object bearing promise of super class values keyed by molotov
   *   indicated
   *    super namespaces.
   */
  requireSupers() {
    return this.validateMolotovSettings()
    .then(() => {
      try {
        // Get nameSpace.
        const nameSpace = this.getMolotovNameSpace();
        const supers = {};
        // require items in this name space.
        Object.keys(
          this.getMolotovSettings()[nameSpace].supersNameSpacePaths
        ).forEach((key) => {
          // For each super in molotov settings attempt to require item.
          // eslint-disable-next-line import/no-dynamic-require
          supers[key] = require(
            path.join(__dirname, this.getMolotovSettings()[nameSpace].supersNameSpacePaths[key])
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
    return this.supers;
  }

  /**
   * resolveSupers()
   *   Gets supers by requiring them. Then checks and merges in overrides.
   *
   * @returns Promise.obj
   *   A object bearing the molotov super classes keyed by super name space
   *    with any user provided config overrides of those supers.
   */
  resolveSupers() {
    let superResolver;
    if (_.has(this, 'supers')) {
      // If we have supers take them from getSupers();
      superResolver = new Promise(res => res(this.getSupers()))
      .then(() => this.validateMolotovSettings());
    }
    else {
      // If we don't have supers yet, require them dynamically
      // from molotov config.
      superResolver = this.requireSupers();
    }

    const superNext = superResolver.then(() => this.fetchOverrides());
    return superNext.then(() => this.mergeConfig());
  }

  // eslint-disable-next-line class-methods-use-this
  getTraceIndex(index) {
    if (index > 0) {
      return index - 1;
    }

    return 0;
  }
};

module.exports = superMixologist;
