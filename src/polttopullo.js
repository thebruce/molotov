// @flow

import type { molotovConfig, overrideConfig, supers, plugins, mixins, ProviderBase } from './types/molotov'; // eslint-disable-line max-len
import type Cocktail from './cocktail';

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
module.exports = class Polttopullo extends molotovProviderBase implements ProviderBase<plugins> {
  mixins: mixins
  plugins: plugins
  /**
   * Create an instance of the Polttopuloo class. This class
   *  is used for mixing plugins.
   *
   * @param {molotovConfig} config
   *   A molotov configuration object.
   * @param {string} nameSpace
   *   THe namespace of your molotov implementing module.
   * @param {object} pSupers
   *   An object of Super classes keyed by the super name.
   * @param {object} pMixins
   *   An object of plugin classes keyed by supers name
   *   and then by the pluginName.
   *   {
   *     superClass: {
   *       pluginName: pluginClass
   *     }
   *   }
   * @param {object} pOverrides
   *   An object with the exact same shape as molotovConfig but
   *     meant as a place to pass through calling modules overrides
   *       to your molotov implementing configuration. Often used for
   *         dynamically or runtime assembled plugins.
   * @param {Array<Cocktail>} pCocktails
   *   An array of cocktail classes used by modules using your molotov
   *   implementing module and providing their own plugins or supers.
   */
  constructor(config: molotovConfig, nameSpace: string, pSupers: supers, pMixins: mixins, pOverrides: (overrideConfig | {}) = {}, pCocktails: Array<?Cocktail>): void { // eslint-disable-line max-len
    const type = 'Plugins';
    const target = 'molotovPlugins';
    super(config, nameSpace, type, target, pOverrides, pCocktails);
    this.setSupers(pSupers);
    this.setMixins(pMixins);
  }

  /**
   * Validate our molotov config for plugins.
   *
   * @returns {boolean}
   *   True if our molotovConfig is valid.
   */
  validateMolotovConfig(): boolean {
    const validator = super.validateMolotovConfig();
    // Now check to see if the plugins we have contain
    // only the mixins we have.
    return validator;
  }
  /**
   * Sets the mixins for this Polttopullo.
   *
   * @param {mixins} mixinObj
   *   An object of mixin classes keyed by super name
   *   and then mixin name with a value of the corresponding
   *   mixin class.
   *
   * @returns {void}
   *
   */
  setMixins(mixinObj: mixins): void {
    this.mixins = mixinObj;
  }

  /**
   * Gets this mixins for this Polttopullo.
   *
   * @returns {mixins}
   *   An object of mixin classes keyed by super name
   *   and then mixin name with a value of the corresponding
   *   mixin class.
   */
  getMixins(): mixins {
    return this.mixins;
  }

  /**
   * Sets the plugin classes for this Polttopullo.
   *
   * @param {plugins} pluginObj
   *   An object keyed by supers name's and then
   *   keyed by plugin names with values of mixin
   *   classes or pre-mixed mixin classes.
   *
   * @returns {void}
   */
  setPlugins(pluginObj: plugins): void {
    this.plugins = pluginObj;
  }

  /**
   * Returns the plugin object for this PolttoPullo.
   *
   * @returns {plugins}
   *   An object keyed by supers name's and then
   *   keyed by plugin names with values of mixin
   *   classes or pre-mixed mixin classes.
   */
  getPlugins(): plugins {
    return this.plugins;
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
  resolve() {
    // merge up config and validate.
    super.resolve();
    // getGetTypes
    // then call GetTypes on cocktails
    // merge down and reset thisType
    this.mixCocktails();
    // run pluginmaker.
    // $FlowFixMe generics not working.
    return this.getPlugins();
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
  mixCocktails(): plugins {
    // Get Plugins
    // Get Plugins from cocktail
    // override and add.
    // Pass this along to super.mixCocktails.
    return this.getPlugins();
  }
};
