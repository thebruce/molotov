// @flow

import type {
  molotovConfig,
  mixins,
  supers,
} from './types/molotov';

const { MolotovError } = require('./molotovError');
const {
  VALID_COCKTAIL_CONFIG_REQUIRED,
} = require('../_errors');

module.exports = class Cocktail {
  cocktailMixins: mixins
  cocktailSupers: supers
  cocktailConfig: molotovConfig
  /**
   * Creates an instance of Cocktail.
   * @param {molotovConfig} cocktailConfig
   *   A molotov style configuration for this cocktail class' plugins
   *   and supers.
   * @param {?superst} cocktailSupers
   *   An object of Super classes keyed by the super name.
   * @param {?mixins} cocktailMixins
   *   An object of plugin classes keyed by supers name
   *   and then by the pluginName.
   *   {
   *     superClass: {
   *       pluginName: pluginClass
   *     }
   *   }
   * @returns {void}
   */
  constructor(cocktailConfig: molotovConfig, cocktailSupers: ?supers, cocktailMixins: ?mixins) { // eslint-disable-line max-len
    // Cocktail classes must atleast have a valid config object.
    // That's the whole point of cocktail.
    // Without this we don't have any new or overriden supers,
    //  mixins, or plugins.
    if (typeof cocktailConfig !== 'object'
      || !cocktailConfig
      || !(Object.keys(cocktailConfig).length > 0)) {
      throw new MolotovError(VALID_COCKTAIL_CONFIG_REQUIRED);
    }
    this.setCocktailConfig(cocktailConfig);
    // If we have cocktail provided supers set them.
    if (cocktailSupers && Object.keys(cocktailSupers).length) {
      this.setCocktailSupers(cocktailSupers);
    }
    // If we have cocktail provided plugins set them.
    if (cocktailMixins && Object.keys(cocktailMixins).length) {
      this.setCocktailMixins(cocktailMixins);
    }
  }

  /**
   * setCocktailConfig
   *
   * @param {cocktailConfig} cocktailConfig
   *    A plugin definition keyed by supers and then keyed by plugin name
   *      with values of the mixin file names it uses.
   * @returns {void}
   */
  setCocktailConfig(cocktailConfig: molotovConfig) {
    this.cocktailConfig = cocktailConfig;
  }

  /**
   * getCocktailConfig().
   *
   * @returns {molotovConfig} pluginDefinitions.
   */
  getCocktailConfig(): molotovConfig {
    return this.cocktailConfig;
  }

  /**
   * setCocktailSupers
   *
   * @param {supers} cocktailSupers
   *   A supers cocktail object.
   * @returns {void}
   */
  setCocktailSupers(cocktailSupers: supers) {
    this.cocktailSupers = cocktailSupers;
  }

  /**
   * getCocktailSupers
   *
   * @returns {supers}
   *   A cocktailSupers object.
   */
  getCocktailSupers(): supers {
    return this.cocktailSupers;
  }

  /**
   * setCocktailPlugins
   *
   * @param {mixins} cocktailMixins
   *   A plugin object.
   * @returns {void}
   */
  setCocktailMixins(cocktailMixins: mixins): void {
    this.cocktailMixins = cocktailMixins;
  }

  /**
   * getCocktailPlugins
   *
   * @returns {mixins}
   *   A plugin object.
   */
  getCocktailMixins(): mixins {
    return this.cocktailMixins;
  }
};
