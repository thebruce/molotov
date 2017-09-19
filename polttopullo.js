'use strict';

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
const polttopullo = class extends molotovProviderBase {
  constructor(molotovConfigPath, supers, plugins, config) {
    let tmpConfig = config;
    if (!config) {
      tmpConfig = {};
    }
    const type = 'Plugins';
    const target = 'molotovPlugins';
    super(molotovConfigPath, type, target, tmpConfig);
    this.setSupers(supers);
    this.setPluginsDirectory(plugins);
  }

  setPluginsDirectory(pluginsDir) {
    this.pluginsDirectory = pluginsDir;
  }

  getPluginsDirectory() {
    return this.pluginsDirectory;
  }

  setPlugins(plugins) {
    this.plugins = plugins;
  }

  getPlugins() {
    return this.plugins;
  }

  resolve() {
    const resolver = this.validateMolotovSettings(this.getValidateTarget())
    .then(() => {
      const plugins = pluginMaker(
        this.getMolotovSettings()[this.getMolotovNameSpace()].molotovPlugins,
        this.getPluginsDirectory(),
        this.getSupers()
      );
      this.setPlugins(plugins);
      return plugins;
    });

    const nextStep = resolver.then(() => this.fetchOverrides());
    return nextStep.then(() => this.mergeConfig(this.getDynamicRequiresType()));
  }
};

module.exports = polttopullo;
