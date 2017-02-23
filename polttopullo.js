'use strict';

const molotovProviderBase = require('./molotovProviderBase');
const pluginMaker = require('./mixinPluginMaker');

/**
 * Molotov class for modules implementing molotov mixin loading.
 * Attempts to provide the module with its default plugins
 * and incorporate any overrides from config.  Modules will extend this class
 * and provide setConfig values, but may also provide declared specific requires
 * to avoid dynamic requires below.
 *
 * Molotov, assumes a few things:
 *  1) Supers s
 *  attempts to merge in configuration entities for
 * schemePunk tranformations, sources, and destinations if they exist in
 * a npm module config compatible configuration. It then attempts to merge
 * those overrides over default configuration for this module and its plugins.
 *
 * This happens in require time. It also sets up the pattern that any
 * configuration override behavior will belong in the application
 * config space rather than other modules. If additional plugin supplying
 * modules are to be included that will need to happen in the app config.
 */
const polttopullo = class extends molotovProviderBase {
  constructor(molotovConfigPath, supers, plugins) {
    const type = 'Plugins';
    const target = 'molotovPlugins';
    super(molotovConfigPath, type, target, supers);

    if (typeof plugins !== 'undefined') {
      this.setPlugins(plugins);
    }
  }

  setPlugins(pluginsDirectoryObject) {
    // Set up the plugin using required plugin setup.
    // Call the plugin maker to create a plugin object
    // keyed by supers name space and plugin name.
    const plugins = pluginMaker(pluginsDirectoryObject, this.getSupers());

    // supers are keyed namespaced.
    this.plugins = plugins;
  }

  getPlugins() {
    return this.plugins;
  }
};

module.exports = polttopullo;
