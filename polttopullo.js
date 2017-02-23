'use strict';

const molotovProviderBase = require('./molotovProviderBase');

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
    super(molotovConfigPath);
    this.setSupers(supers);

    if (typeof supers !== 'undefined') {
      this.setPlugins(plugins);
    }
  }

  setPlugins(plugins) {
    this.plugins = plugins;
  }

  getPlugins() {
    return this.plugins;
  }

  exportPlugins() {
    // Ensure that we have supers.
    // Ensure that we have plugins or load them.

    // attempt to load up overrides for plugins.

    // based on the molotov config definitions of plugins create a
    // plugin structure like we did in scheme punk
    // and export.
  }
};

module.exports = polttopullo;
