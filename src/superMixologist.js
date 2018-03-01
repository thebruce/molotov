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
const _ = require('lodash');
const molotovProviderBase = require('./molotovProviderBase');
const Cocktail = require('./cocktail');
const {
  COCKTAIL_SUPERS_NOT_DEFINED_IN_COCKTAIL_CONFIG,
} = require('../_errors');

const {
  MolotovError,
} = require('./molotovError');

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
   * @returns {void}
   */
  mixCocktails() {
    const cocktailsArray = this.molotov.getCocktails();
    let tempSupers = this.molotov.getSupers();
    // Do we have any cocktails?
    if (cocktailsArray.length) {
      // We have cocktail classes. Build up our supers
      // by calling this for each.
      cocktailsArray.forEach((cocktail) => {
        if (cocktail instanceof Cocktail && cocktail.getCocktailSupers()) {
          const cocktailSupersClasses: supers = cocktail.getCocktailSupers();
          // We have supers in our cocktail class. Ensure we have matching config declarations.
          const cocktailConfigSupers = cocktail.getCocktailConfig()[this.molotov.getNameSpace()].supersNameSpace;
          if (_.difference(cocktailConfigSupers, Object.keys(cocktailSupersClasses).length > 0)) {
            throw new MolotovError(COCKTAIL_SUPERS_NOT_DEFINED_IN_COCKTAIL_CONFIG);
          }
          // Everything is looking bright and cheery.
          // add cocktail supers to our supers.
          tempSupers = _.merge(tempSupers, cocktail.getCocktailSupers());
          // now merge just the supers config and see if we have an issue.
        }
      });
      this.molotov.setSupers(tempSupers);
    }
  }
  /**
   * Resolves all supers.
   *
   * @returns {supers}
   *   Returns resolved supers.
   */
  resolve(): supers {
    // Take config from molotov implementing module
    // and merge config from overrides.
    this.mergeConfig();

    if (!this.validateMolotovConfig()) {
      throw new Error(`Merging molotovConfig and provided overrides has resulted in an malformed configuration for molotov implementing module ${this.molotov.getNameSpace()}`);
    }
    // Now get any cocktails overrides.
    this.mixCocktails();
    return this.molotov.getSupers();
  }
};
