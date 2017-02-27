'use strict';

const _ = require('lodash');
const pluginMaker = require('./mixinPluginMaker');

module.exports = class {
  constructor(molotovProvider, cocktailPluginDefinitions, modulesPluginDirectory, modulesSupers) {
    // Get their supers, and plugins.
    this.setMolotovSupers(molotovProvider.getSupersDirectory());
    this.setMolotovPlugins(molotovProvider.getPluginDirectory());
    // if our plugins - set our plugins
    this.setCocktailPluginDefinitions({});
    this.setCocktailSupers({});
    this.setCocktailPlugins({});
    if (cocktailPluginDefinitions) {
      this.setCocktailPluginDefinitions(cocktailPluginDefinitions);
    }
    // if our supers - set our supers
    if (modulesSupers) {
      this.setCocktailSupers(modulesSupers);
    }
    // merge supers and plugins
    if (modulesPluginDirectory) {
      this.setCocktailPlugins(modulesPluginDirectory);
    }

    this.mergeSupers();
    this.mergePlugins();
  }

  setCocktailPluginDefinitions(cocktailPluginDefinitions) {
    this.cocktailPluginDefinitions = cocktailPluginDefinitions;
  }

  getCocktailPluginDefinitions() {
    return this.cocktailPluginDefinitions;
  }

  mergeSupers() {
    const mergedSupers = _.merge(this.getMolotovSupers(), this.getCocktailSupers());
    this.setMergedSupers(mergedSupers);
  }

  setMergedSupers(mergedSupers) {
    // Merge supers
    this.mergedSupers = mergedSupers;
  }

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
