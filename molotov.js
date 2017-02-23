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

module.exports = function getMolotov(molotovPath, supers, plugins) {
  const superMixologist = new SuperMixologist(molotovPath, supers);
  return superMixologist.resolveSupers()
    .then(resolvedSupers => new Polttopullo(resolvedSupers, plugins));
};
