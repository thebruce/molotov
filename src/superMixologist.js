// @flow

import type { supers, targetSns, ProviderBase, ProviderImplementation } from './types/molotov';
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
const validator = require('./validateConfig');

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

module.exports = class SuperMixologist extends molotovProviderBase<targetSns> implements ProviderBase<targetSns>, ProviderImplementation<supers> { // eslint-disable-line max-len
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
    const targetType: targetSns = 'supersNameSpace';
    super(molotovInstance, type, targetType);
  }

  /**
   * Integrates any cocktail provided classes supers into the molotov supers.
   *
   * @returns {void}
   */
  mixCocktails(): void {
    const cocktailsArray = this.molotov.getCocktails();
    const nameSpace = this.molotov.getNameSpace();
    const tempSupers = this.molotov.getSupers();
    // Do we have any cocktails?
    if (cocktailsArray.length) {
      // We have cocktail classes. Build up our supers
      // by calling this for each.
      cocktailsArray.forEach((cocktail) => {
        if (cocktail instanceof Cocktail && cocktail.getCocktailSupers()) {
          const cocktailSupersClasses: supers = cocktail.getCocktailSupers();
          // We have supers in our cocktail class. Ensure we have
          // matching config declarations.
          const cocktailConfigSupers = cocktail.getCocktailConfig()[nameSpace][this.getTarget()];
          // Get all possible keys for supers
          const allSupersKeys = _.concat(Object.keys(cocktailSupersClasses), Object.keys(tempSupers));
          if (_.difference(_.values(cocktailConfigSupers), allSupersKeys).length > 0) { // eslint-disable-line max-len
            throw new MolotovError(COCKTAIL_SUPERS_NOT_DEFINED_IN_COCKTAIL_CONFIG);
          }
          // now merge just the supers config.
          const tempSupersConfig = this.createPartialConfig(cocktailConfigSupers);

          this.mergeConfig(this.molotov.getMolotovConfig(), tempSupersConfig);
          // Now set the supers overrides in accordance with
          // this newly merged config.
          // $FlowFixMe
          _.forEach(Object.keys(cocktailConfigSupers), (value) => {
            // Attempt to get any overrides or new classes from cocktailSupers.
            // Otherwise use existing.
            const tempClass = _.get(cocktailSupersClasses, cocktailConfigSupers[value], tempSupers[value]); // eslint-disable-line max-len
            // Now set the key to tempClass.
            _.set(tempSupers, `${value}`, tempClass);
          }, this);
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
    this.fetchOverrides();
    this.validateMolotovConfig();

    // Now get any cocktails overrides.
    this.mixCocktails();
    return this.molotov.getSupers();
  }
};
