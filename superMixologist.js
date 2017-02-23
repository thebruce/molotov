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
const path = require('path');
const _ = require('lodash');
const stack = require('callsite');
const molotovProviderBase = require('./molotovProviderBase');

// Users instantiate superMixologist.
// superMixologist = new SuperMixologist(pathToProviderModule);
// To use the new instantiated super to return this providers supers we:
// const providerSupers = superMixologist.getSupers();

const superMixologist = class extends molotovProviderBase {
  /**
   * constructor for the superMixologistAbstract.
   *
   * @params {string} molotovConfigpath
   *   The base path of the molotovConfig file for the provider module
   *     for these super classes.
   */
  constructor(molotovConfigpath, supers) {
    super(molotovConfigpath);
    if (typeof supers !== 'undefined') {
      this.setSupers(supers);
    }
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
   * requireSupers
   *  Populates molotov provider indicated supers by requiring their classes.
   *
   * @returns {Promise.object}
   *   An object bearing promise of super class values keyed by molotov
   *   indicated
   *    super namespaces.
   */
  requireSupers() {
    return this.validateMolotovSettings('supersNameSpacePaths')
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
      .then(() => this.validateMolotovSettings('supersNameSpacePaths'));
    }
    else {
      // If we don't have supers yet, require them dynamically
      // from molotov config.
      superResolver = this.requireSupers();
    }

    const superNext = superResolver.then(() => this.fetchOverrides());
    return superNext.then(() => this.mergeConfig('Supers'));
  }
};

module.exports = superMixologist;
