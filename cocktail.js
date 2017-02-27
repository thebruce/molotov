'use strict';

const _ = require('lodash');
const pluginMaker = require('./mixinPluginMaker');
const config = require('config');

module.exports = class {
  /**
   * cocktail class
   *
   * @params {obj} molotovProvider
   *   The Molotov class implemented by a molotov provider module.
   * @params {obj} optional cocktailPluginDefinitions
   *   An object of plugin definitions. If not provided will be extracted from config. Config must come from one of the two places.
   * @params {obj} optional modulesPluginDirectory
   *   If the cocktail implementing module is providing its own plugins, please require and supply them here.
   * @params {obj} optional modulesSupers
   *   If the cocktail implementing module is providing its own supers please require them and supply them here.
   *
   */
  constructor(molotovProvider, cocktailPluginDefinitions, modulesPluginDirectory, modulesSupers) {
    // Get their supers, and plugins.
    this.setMolotovSupers(molotovProvider.getSupersDirectory());
    this.setMolotovPlugins(molotovProvider.getPluginDirectory());
    // if our plugins - set our plugins
    this.setCocktailPluginDefinitions({});
    this.setCocktailSupers({});

    if (cocktailPluginDefinitions) {
      this.setCocktailPluginDefinitions(cocktailPluginDefinitions);
    }
    else {
      if (!config.molotov.cocktailPlugins) {
        throw new Error('Cocktail must declare plugins.');
      }
      this.setCocktailPluginDefinitions(config.molotov.cocktailPlugins);
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

  mergePlugins() {
    const mergePlugins = _.merge(this.getMolotovPlugins(), this.getCocktailPlugins());
    this.setMergedPlugins(mergePlugins);
  }

  setMergedPlugins(mergedPlugins) {
    // Merge Plugins.
    this.mergedPlugins = mergedPlugins;
  }

  getMergedPlugins() {
    return this.mergedPlugins;
  }

  setCocktailSupers(cocktailSupers) {
    this.cocktailSupers = cocktailSupers;
  }

  getCocktailSupers() {
    return this.cocktailSupers;
  }

  setMolotovSupers(molotovSupers) {
    this.molotovSupers = molotovSupers;
  }

  getMolotovSupers() {
    return this.molotovSupers;
  }

  getMolotovPlugins() {
    return this.molotovPlugins;
  }

  setMolotovPlugins(molotovPlugins) {
    this.molotovPlugins(molotovPlugins);
  }

  setCocktailPlugins(cocktailPlugins) {
    this.cocktailPlugins = cocktailPlugins;
  }

  getCocktailPlugins() {
    return this.cocktailPlugins;
  }

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
