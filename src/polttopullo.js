// @flow

import type { plugins, ProviderBase, ProviderImplementation, targetMp } from './types/molotov'; // eslint-disable-line max-len
import type molotov from './molotov';

const molotovProviderBase = require('./molotovProviderBase');
const pluginMaker = require('./mixinPluginMaker');

/**
 * Molotov class for modules implementing molotov mixin loading.
 * Attempts to provide the module with its default plugins
 * and incorporate any overrides from passed in configuration.
 * Modules will extend this class and provide setConfig values,
 * but may also provide declared specific requires
 * to avoid dynamic requires below.
 *
 * Molotov, assumes a few things:
 *  1) Supers s
 *  attempts to merge passed in configuration entities. It then
 *    attempts to merge those overrides over default configuration for
 *       this module and its plugins.
 *
 * This happens in require time. It also sets up the pattern that any
 * configuration override behavior will belong in the application
 * config space rather than other modules. If additional plugin supplying
 * modules are to be included that will need to happen in the app config.
 */
module.exports = class Polttopullo extends molotovProviderBase<targetMp> implements ProviderBase<targetMp>, ProviderImplementation<plugins> { // eslint-disable-line max-len
  /**
   * Create an instance of the Polttopuloo class. This class
   *  is used for mixing plugins.
   *
   * @param {molotov} molotovInstance
   *   A molotov configuration object.
   */
  constructor(molotovInstance: molotov): void { // eslint-disable-line max-len
    const type = 'Plugins';
    const target = 'molotovPlugins';
    super(molotovInstance, type, target);
  }

  /**
   * Returns cocktails for this class' target.
   *
   * @template T
   * @param {T} targetItem
   *   The target classes item.
   * @returns {T}
   *   The target classes item.
   */
  mixCocktails(): void {
    // Get Plugins
    // Get Plugins from cocktail
    // override and make plugins.
    // pass write to molotov.
    // Pass this along to super.mixCocktails.
    // Do we have any plugin definitions to add?
    // If so all the mixins used in those definitions should
    // exist in the summation of all mixins.

    // Do we have supers.
    // Add any supers to config.
    // By checking to see if we have any superNameSpacePaths
    // for the molotov.getNameSpace()

  }
  /**
   * Creates mixed plugins ensuring that modules who are using molotov
   *   implementing modules have their overrides and Cocktail classes
   *   factored into the plugin
   *   mixing.
   *
   * @returns {plugins}
   *   Returns mixed plugins taking into account molotov implementing modules'
   *   supers and plugins and ensuring that users of those implementing modules
   *   can provide overrides and their own plugs and supers through Cocktail
   *   classes.
   */
  resolve(): plugins {
    this.fetchOverrides();

    if (!this.validateMolotovConfig()) {
      throw new Error(`Merging molotovConfig and provided overrides has resulted in an malformed configuration for molotov implementing module ${this.molotov.getNameSpace()}`);
    }
    // getGetTypes
    // then call GetTypes on cocktails
    // merge down and reset thisType
    this.mixCocktails();
    // run pluginmaker.
    return this.molotov.getPlugins();
  }
};
