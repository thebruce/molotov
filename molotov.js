'use strict';

const SuperMixologist = require('./superMixologist');
const Polttopullo = require('./polttopullo');

// Use the simple version for easy and dynamic plugin and super loading.
// Note: this can be more expensive as a result of the dynamic requires.
// const molotov = require('yourMolotov')('requiredPathToMolotovConfig');
// Now you can return the molotov promise and take action.
// molotov.getMolotov().then(molotov => {
//   // Get all of the molotov plugins for our module.
//   const molotovPlugins = molotov.exportPlugins();
// })

//  OR create your own loader class with declarative requires
// to lessen blocking operations.
// Declarative version your `MolotovLoaderClass.`
// const requireDirectory = require('require-directory');
// const supers = requireDirectory('supersDirectory');
// const plugins = requireDirectory('pathToPlugins');

// const molotov = require('molotov')('pathToMolotovConfig', supers, plugins);
// module.exports = molotov;

// Usage is fairly similar

// molotov = require('pathToYourMolotovLoaderClass');

// In the Implementing modules
// molotov.getMolotov().then(molotov => {
//   // Get all of the molotov plugins for our module.
//   const molotovPlugins = molotov.exportPlugins();
// })

const molotov = class {
  constructor(molotovPath, molotovNameSpace, supersDirectory, pluginDirectory) {
    if ((!molotovPath) || (typeof molotovPath !== 'string')) {
      throw new Error('molotovPath is required and must be a string.');
    }
    if ((typeof supersDirectory !== 'object')) {
      throw new Error('supers is required and must be an object');
    }
    if ((Object.keys(pluginDirectory).length === 0) || (typeof pluginDirectory !== 'object')) {
      throw new Error('plugins is required and must be an object');
    }
    this.setNameSpace(molotovNameSpace);
    this.setMolotovPath(molotovPath);
    this.setSupersDirectory(supersDirectory);
    this.setPluginDirectory(pluginDirectory);
  }

  setPluginDirectory(pluginDirectory) {
    this.pluginDirectory = pluginDirectory;
  }

  getPluginDirectory() {
    return this.pluginDirectory;
  }

  getSupers() {
    const superMixologist = new SuperMixologist(this.getMolotovPath(), this.getSupersDirectory());
    return superMixologist.resolve();
  }

  setMolotovPath(molotovPath) {
    this.molotovPath = molotovPath;
  }

  getMolotovPath() {
    return this.molotovPath;
  }

  setSupersDirectory(supersDirectory) {
    this.supersDirectory = supersDirectory;
  }

  getSupersDirectory() {
    return this.supersDirectory;
  }

  getMolotov() {
    return this.getSupers()
    .then(resolvedSupers => new Polttopullo(
      this.getMolotovPath(),
      resolvedSupers,
      this.getPluginDirectory())
    );
  }

  setNameSpace(nameSpace) {
    this.molotovNameSpace = nameSpace;
  }

  getNameSpace() {
    return this.molotovNameSpace;
  }
};


module.exports = molotov;
