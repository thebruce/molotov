'use strict';

const _ = require('lodash');
const pluginMaker = require('./mixinPluginMaker');

module.exports = class {
  /**
   * cocktail class
   *
   * @params {obj} molotovProvider
   *   The Molotov class implemented by a molotov provider module.
   * @params {obj} optional cocktailPluginDefinitions
   *   An object of plugin definitions.
   * @params {obj} optional modulesPluginDirectory
   *   If the cocktail implementing module is providing its own plugins,
   *     please require and supply them here.
   * @params {obj} optional modulesSupers
   *   If the cocktail implementing module is providing its own supers
   *    please require them and supply them here.
   */
  constructor(molotovProvider, cocktailPluginDefinitions, modulesPluginDirectory, modulesSupers) {
    // Get their supers, and plugins.
    this.setMolotovSupers(molotovProvider.getSupersDirectory());
    this.setMolotovPlugins(molotovProvider.getPluginDirectory());
    this.setMolotovNameSpace(molotovProvider.getNameSpace());
    // if our plugins - set our plugins
    this.setCocktailPluginDefinitions({});
    this.setCocktailSupers({});

    if (typeof cocktailPluginDefinitions === 'object'
      && Object.keys(cocktailPluginDefinitions).length > 0) {
      this.setCocktailPluginDefinitions(cocktailPluginDefinitions);
    }
    else if (_.has(molotovProvider.getConfig(), `molotov.cocktailPlugins[${this.getMolotovNameSpace()}]`)) {
      this.setCocktailPluginDefinitions(molotovProvider.getConfig().molotov.cocktailPlugins[this.getMolotovNameSpace()]);
    }
    else {
      throw new Error('Cocktail must declare plugins.');
    }
    // If we have cocktail provided supers set them.
    if (modulesSupers) {
      this.setCocktailSupers(modulesSupers);
    }
    // If we have cocktail provided plugins set them.
    if (modulesPluginDirectory) {
      this.setCocktailPlugins(modulesPluginDirectory);
    }
    // merge supers and plugins
    this.mergeSupers();
    this.mergePlugins();
  }

  /**
   * setCocktailPluginDefinitions
   *
   * @param {obj} cocktailPluginDefinitions
   *    A plugin definition keyed by supers and then keyed by plugin name
   *      with values of the mixin file names it uses.
   */
  setCocktailPluginDefinitions(cocktailPluginDefinitions) {
    this.cocktailPluginDefinitions = cocktailPluginDefinitions;
  }

  /**
   * getCocktailPluginDefinitions.
   *
   * @returns {obj} pluginDefinitions.
   */
  getCocktailPluginDefinitions() {
    return this.cocktailPluginDefinitions;
  }

  /**
   * mergeSupers
   *   Merges molotov supers and cocktailSupers (if defined).
   */
  mergeSupers() {
    const mergedSupers = _.merge(this.getMolotovSupers(), this.getCocktailSupers());
    this.setMergedSupers(mergedSupers);
  }

  /**
   * Sets the merged supers.
   *
   * @param {obj} mergedSupers
   *   An object of merged supers.
   */
  setMergedSupers(mergedSupers) {
    // Merge supers
    this.mergedSupers = mergedSupers;
  }

  /**
   * getMergedSupers
   *
   * @returns mergedSupers
   */
  getMergedSupers() {
    return this.mergedSupers;
  }

  /**
   *  Merges molotov plugins and cocktail plugins (if provided).
   *
   */
  mergePlugins() {
    const mergePlugins = _.merge(this.getMolotovPlugins(), this.getCocktailPlugins());
    this.setMergedPlugins(mergePlugins);
  }

  /**
   * setMergedPlugins
   *
   * @param {obj} mergedPlugins
   *   Merged molotov and cocktail plugins.
   */
  setMergedPlugins(mergedPlugins) {
    // Merge Plugins.
    this.mergedPlugins = mergedPlugins;
  }

  /**
   * getMergedPlugins
   *
   * @returns {obj}
   *   Merged molotov and cocktail plugins.
   */
  getMergedPlugins() {
    return this.mergedPlugins;
  }

  /**
   * setCocktailSupers
   *
   * @param {obj} cocktailSupers
   *   A supers cocktail object.
   */
  setCocktailSupers(cocktailSupers) {
    this.cocktailSupers = cocktailSupers;
  }


  /**
   * getCocktailSupers
   *
   * @returns {obj}
   *   A cocktailSupers object.
   */
  getCocktailSupers() {
    return this.cocktailSupers;
  }

  /**
   * setMolotovSupers
   *
   * @param {obj} molotovSupers
   *   A supers object.
   */
  setMolotovSupers(molotovSupers) {
    this.molotovSupers = molotovSupers;
  }

  /**
   * getMolotovSupers().
   *
   * @returns {obj}
   *   A supers object.
   */
  getMolotovSupers() {
    return this.molotovSupers;
  }

  /**
   * getMolotovPlugins.
   *
   * @returns {obj}
   *   A plugins object.
   */
  getMolotovPlugins() {
    return this.molotovPlugins;
  }

  /**
   * setMolotovPlugins
   *
   * @param {obj} molotovPlugins
   *   A plugins object.
   */
  setMolotovPlugins(molotovPlugins) {
    this.molotovPlugins = molotovPlugins;
  }

  /**
   * setCocktailPlugins
   *
   * @param {obj} cocktailPlugins
   *   A plugin object.
   */
  setCocktailPlugins(cocktailPlugins) {
    this.cocktailPlugins = cocktailPlugins;
  }

  /**
   * getCocktailPlugins
   *
   * @returns {obj}
   *   A plugin object.
   */
  getCocktailPlugins() {
    return this.cocktailPlugins;
  }

  setPlugins(plugins) {
    this.plugins = plugins;
  }

  getPlugins() {
    return this.plugins;
  }

  setMolotovNameSpace(nameSpace) {
    this.molotovNameSpace = nameSpace;
  }

  getMolotovNameSpace() {
    return this.molotovNameSpace;
  }

  /**
   * resolve
   *
   * @returns {obj}
   *   A resolved plugin object.
   */
  resolve() {
    const plugins = pluginMaker(
      this.getCocktailPluginDefinitions(),
      this.getMergedPlugins(),
      this.getMergedSupers()
    );
    this.setPlugins(plugins);
    return plugins;
  }
};
