'use strict';

const SuperMixologist = require('./superMixologist');
const Polttopullo = require('./polttopullo');

// Declarative version your `MolotovLoaderClass.`
// const supers = require('supersDirectory');
// const plugins = require('pathToPlugins');

// const Molotov = require('molotov');
// const molotov = Molotov(
//    molotovConfigObject,
//    'nameSpaceofYourModule',
//    supers,
//    plugins
// );
// module.exports = molotov;

// Then require your molotov in your classes.
// const molotov = require('pathToYourMolotovLoaderClass');

// And call 'getMolotov()'
// molotov.getMolotov().then(molotov => {
//   // Get all of the molotov plugins for our module.
//   const resolvedPlugins = molotov.getPlugins();
// })
const molotov = class {
  /**
   * Create an instance of the molotov class. This class is meant
   *   to be extended by molotov plugin implementing modules.
   *
   * @param {object} molotovConfig
   *   A molotov configuration object.
   * @param {string} nameSpace
   *   THe namespace of your molotov implementing module.
   * @param {object} supers
   *   An object of Super classes keyed by the super name.
   * @param {object} plugins
   *   An object of plugin classes keyed by supers name
   *   and then by the pluginName.
   *   {
   *     superClass: {
   *       pluginName: pluginClass
   *     }
   *   }
   * @param {object} configOverrides
   *   An object with the exact same shape as molotovConfig but
   *     meant as a place to pass through calling modules overrides
   *       to your molotov implementing configuration. Often used for
   *         dynamically or runtime assembled plugins.
   * @param {Cocktail} cocktails
   *   An array of cocktail classes used by modules using your molotov
   *   implementing module and providing their own plugins or supers.
   */
  constructor(molotovConfig, nameSpace, supers, plugins, configOverrides = {}, cocktails = []) {
    if ((!molotovConfig) || (typeof molotovConfig !== 'object')) {
      throw new Error('molotovConfig is required and must be an molotov config object.');
    }
    if ((typeof supers !== 'object')) {
      throw new Error('supers is required and must be an object');
    }
    if ((Object.keys(plugins).length === 0) || (typeof plugins !== 'object')) {
      throw new Error('plugins is required and must be an object');
    }
    if ((typeof configOverrides !== 'object')) {
      throw new Error('Configuration overrides must be an object.');
    }
    if (!Array.isArray(cocktails)) {
      throw new Error('Cocktails must be passed as an array.');
    }
    this.setNameSpace(nameSpace);
    this.setMolotovConfig(molotovConfig);
    this.setSupers(supers);
    this.setPlugins(plugins);
    this.setConfigOverridess(configOverrides);
    this.setCocktails(cocktails);
  }

  setMolotovConfig(config) {
    this.molotovConfig = config;
  }

  getMolotovConfig() {
    return this.molotovConfig;
  }

  setPlugins(plugins) {
    this.plugins = plugins;
  }

  getPlugins() {
    return this.plugins;
  }

  setSupers(supers) {
    this.supers = supers;
  }

  getSupers() {
    return this.supers;
  }

  mixSupers() {
    const superMixologist = new SuperMixologist(
      this.getMolotovConfig(),
      this.getSupers(),
      this.getOverrides(),
      this.getCocktails()
    );
    return superMixologist.resolve();
  }

  getMolotov() {
    return this.mixSupers()
    .then(resolvedSupers => new Polttopullo(
      this.getMolotovConfig(),
      resolvedSupers,
      this.getPlugins(),
      this.getOverrides(),
      this.getCocktails()
    )
    );
  }

  setNameSpace(nameSpace) {
    this.nameSpace = nameSpace;
  }

  getNameSpace() {
    return this.molotovNameSpace;
  }

  setConfigOverrides(overrides) {
    this.configOverrides = overrides;
  }

  getConfigOverrides() {
    return this.configOverrides;
  }

  /**
   * Set cocktails for this molotov.
   *
   * @param {cocktail[]} cocktails
   *   An array of cocktail classes. Higher positions take precedence
   *   in overrides.
   */
  setCocktails(cocktails) {
    this.cocktails = cocktails;
  }

  getCocktails() {
    return this.cocktails;
  }
};

module.exports = molotov;
