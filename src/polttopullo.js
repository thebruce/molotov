// @flow

import type { plugins, pluginsList, mixins, ProviderBase, ProviderImplementation, targetMp } from './types/molotov'; // eslint-disable-line max-len
import type molotov from './molotov';

const molotovProviderBase = require('./molotovProviderBase');
const Cocktail = require('./cocktail');
const pluginMaker = require('./mixinPluginMaker');
const _ = require('lodash');

const {
  COCKTAIL_CONFIG_USES_UNDEFINED_MIXINS,
} = require('../_errors');

const {
  MolotovError,
} = require('./molotovError');


/**
 * Poltopullo attempts to provide plugins as defined in a molotov
 * implementer's molotov config and passed in molotov plugin object.
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
   * Integrates and cocktail provided plugins into the molotov plugins.
   *
   * @returns {void}
   *   The target classes item.
   */
  mixCocktails(): void {
    const cocktailsArray = this.getMolotov().getCocktails();
    const nameSpace = this.molotov.getNameSpace();
    let tempMixins = this.molotov.getMixins();
    // Get plugins set up if there are no cocktails.
    this.molotov.setPlugins(pluginMaker(this.molotov.getMolotovConfig()[nameSpace].molotovPlugins, this.molotov.getMixins(), this.molotov.getSupers())); // eslint-disable-line max-len
    // Do we have any cocktails?
    if (cocktailsArray.length) {
      // We have cocktail classes. Build up our mixins
      // by calling this for each.
      cocktailsArray.forEach((cocktail) => {
        if (cocktail instanceof Cocktail && cocktail.getCocktailMixins()) {
          const cocktailMixinClasses: mixins = cocktail.getCocktailMixins();
          // We have mixins in our cocktail class. Let's make sure
          // that we only reference mixins in our cocktail plugin definiitons
          // that we will have available to us.

          // Cocktail mixins are used to make plugins. In config plugins
          // are keys of the molotovPlugins object.
          // A plugins value is an array of mixins. So we union those
          // array values to get all mixins.
          const cocktailConfigMixins = this.getMixinsFromPluginConfig(cocktail.getCocktailConfig()[nameSpace][this.getTarget()]); // eslint-disable-line max-len
          const cocktailMixinsObjectKeys = this.getMixinsFromPluginObject(cocktailMixinClasses);
          const molotovMixinsObjectKeys = this.getMixinsFromPluginObject(tempMixins);

          const allMixinKeys = _.uniq(_.concat(cocktailMixinsObjectKeys, molotovMixinsObjectKeys));

          if (_.difference(cocktailConfigMixins, allMixinKeys).length > 0) { // eslint-disable-line max-len
            throw new MolotovError(COCKTAIL_CONFIG_USES_UNDEFINED_MIXINS, `The plugins ${_.difference(cocktailConfigMixins, allMixinKeys).join(',')} were indicated but not included.`); // eslint-disable-line max-len
          }
          // now merge the all of the mixins.
          tempMixins = _.merge(tempMixins, cocktailMixinClasses);
          this.molotov.setMixins(tempMixins);
          // Merge in plugin config.
          const tempPluginsConfig = this.createPartialConfig(cocktail.getCocktailConfig()[nameSpace][this.getTarget()]); // eslint-disable-line max-len
          this.mergeConfig(this.molotov.getMolotovConfig(), tempPluginsConfig);
          // Now make some plugins.
          this.molotov.setPlugins(pluginMaker(this.molotov.getMolotovConfig()[nameSpace].molotovPlugins, this.molotov.getMixins(), this.molotov.getSupers())); // eslint-disable-line max-len
        }
      }, this);
    }
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
    // Take config from molotov implementing module
    // and merge config from overrides.
    this.fetchOverrides();
    this.validateMolotovConfig();

    // Now get any cocktails overrides.
    this.mixCocktails();
    return this.molotov.getPlugins();
  }
  /**
   * Unwraps a plugins config very delicately to get the juicy mixins inside.
   *
   * @param {pluginsList} pluginsObj
   *   A list of plugins for molotov.
   * @returns {string[]}
   *   An array of mixin names.
   */
  getMixinsFromPluginConfig(pluginsObj: pluginsList): string[] {
    return _.union(_.flattenDeep(_.map(_.values(pluginsObj), item => _.flattenDeep(_.values(item))))); // eslint-disable-line max-len
  }
  /**
   * Unwraps a plugins object very delicately to get the juicy mixins inside.
   *
   * @param {{}} pluginsObj
   *   A list of plugins for molotov.
   * @returns {string[]}
   *   An array of mixin names.
   */
  getMixinsFromPluginObject(pluginsObj: {}): string[] {
    return _.union(_.flattenDeep(_.map(_.values(pluginsObj), item => _.flattenDeep(_.keys(item))))); // eslint-disable-line max-len
  }
};
