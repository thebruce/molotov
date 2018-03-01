// @flow

import type { molotovConfig, overrideConfig, supers, target, ProviderBase } from './types/molotov';
import type Cocktail from './cocktail';

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

module.exports = class SuperMixologist extends molotovProviderBase implements ProviderBase<supers> {
  /**
   * Create an instance of the superMixologist class. This class is for
   *   mixing supers.
   *
   * @param {molotovConfig} config
   *   A molotov configuration object.
   * @param {string} nameSpace
   *   THe namespace of your molotov implementing module.
   * @param {object} sSupers
   *   An object of Super classes keyed by the super name.
   * @param {object} sOverrides
   *   An object with the exact same shape as molotovConfig but
   *     meant as a place to pass through calling modules overrides
   *       to your molotov implementing configuration. Often used for
   *         dynamically or runtime assembled plugins.
   * @param {Array<Cocktail>} sCocktails
   *   An array of cocktail classes used by modules using your molotov
   *   implementing module and providing their own plugins or supers.
   */
  constructor(config: molotovConfig, nameSpace: string, sSupers: supers, sOverrides: (overrideConfig | {}) = {}, sCocktails: Array<?Cocktail>): void { // eslint-disable-line max-len
    const type = 'Supers';
    const targetType: target = 'supersNameSpace';
    super(config, nameSpace, type, targetType, sOverrides, sCocktails);
    if (typeof sSupers === 'object') {
      this.setSupers(sSupers);
    }
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
    // override and add.
    // Pass this along to super.mixCocktails.
    return this.getSupers();
  }
  /**
   * Resolves all supers.
   *
   * @returns {supers}
   *   Returns resolved supers.
   */
  resolve() {
    super.resolve();
    this.mixCocktails();
    // $FlowFixMe
    return this.getSupers();
  }
};
