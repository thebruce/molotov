'use strict';

/**
 * This class an implementation of the molotovProviderBase class.
 * It is meant to provide a streamlined super class implementation.
 *
 *  If overrides have been specified in config
 * we will attempt to load them in to override our default supers with them
 * for mixin construction.
 */

// User overrides are stored in config.
const molotovProviderBase = require('./molotovProviderBase');

// Users instantiate superMixologist.
// superMixologist = new SuperMixologist(pathToProviderModule);
// To use the new instantiated super to return this providers supers we:
// const providerSupers = superMixologist.getSupers();

const superMixologist = class extends molotovProviderBase {
  /**
   * constructor for the superMixologistAbstract.
   *
   * @param {string} molotovConfig
   *   The base path of the molotovConfig file for the provider module
   *     for these super classes.
   * @param {object} supers
   *   A supers object.
   * @param {object} overrides
   *   Overrides for molotov. These could be dynamic or provided
   *     by module using a molotov implementer.
   * @param {array} cocktails
   *   An array of cocktail classes.
   */
  constructor(molotovConfig, supers, overrides = {}, cocktails = []) {
    const type = 'Supers';
    const target = 'supersNameSpacePaths';
    super(molotovConfig, type, target, overrides, cocktails);
    if (typeof supers === 'object') {
      this.setSupers(supers);
    }
  }
};

module.exports = superMixologist;
