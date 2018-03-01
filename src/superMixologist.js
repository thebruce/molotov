// @flow

import type { supers, target, ProviderBase, ProviderImplementation } from './types/molotov';
import type molotov from './molotov';

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

module.exports = class SuperMixologist extends molotovProviderBase implements ProviderBase, ProviderImplementation<supers> { // eslint-disable-line max-len
  molotov: molotov
  /**
   * Create an instance of the superMixologist class. This class is for
   *   mixing supers.
   *
   * @param {molotov} molotovInstance
   *   A molotov configuration object.
   *
   * @returns {void}
   */
  constructor(molotovInstance: molotov): void { // eslint-disable-line max-len
    const type = 'Supers';
    const targetType: target = 'supersNameSpace';
    super(molotovInstance, type, targetType);
  }
  /**
   * Validate our molotov config for supers.
   *
   * @returns {boolean}
   *   True if our molotovConfig is valid.
   */
  validateMolotovConfig(): boolean {
    const validator = super.validateMolotovConfig();
    // Now check to see if we have the same supers keys as we have
    // passed in supers.
    return validator;
  }

  /**
   * Returns cocktails for this class' target.
   *
   * @returns {supers}
   *   The target classes item.
   */
  mixCocktails(): supers {
    // GetSupers
    // Get Supers from cocktail
    // override and add to molotv
    // Pass this along to super.mixCocktails.
    return this.molotov.getSupers();
  }
  /**
   * Resolves all supers.
   *
   * @returns {supers}
   *   Returns resolved supers.
   */
  resolve(): supers {
    this.mergeConfig();

    if (!this.validateMolotovConfig()) {
      throw new Error(`Merging molotovConfig and provided overrides has resulted in an malformed configuration for molotov implementing module ${this.molotov.getNameSpace()}`);
    }
    this.mixCocktails();
    return this.molotov.getSupers();
  }
};
