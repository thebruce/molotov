// Using config module with this module's default config.
const requireDirectory = require('require-directory');

// require Supers directory.
const supers = requireDirectory(module, './helpers/supers');

// Require pluginDirs.
const plugins = requireDirectory(module, './helpers/plugins');

const molotovPath = './.molotov.json';

// Require molotov and pass path, super directory object and plugins.
const molotov = require('../../molotov')(molotovPath, supers, plugins);

/**
 * SchemePunkTransformBase function returns a class object that when supplied
 * with a plugin returns a mixin class or without a plugin a base class.
 *
 * @param  obj options
 *  An options object with a key name in options.plugin.
 * @return object
 *   A schemePunkTransformBase class.
 */
module.exports = function implementFactory(superNameSpace, pluginName) {
  molotov.getMolotov().then((newMolotov) => {
    // Get all of the molotov plugins for our module.
    const molotovPlugins = newMolotov.resolve();
    return molotovPlugins;
  })
  .then(
    returnedPlugins =>
      class exampleClassBase extends returnedPlugins[superNameSpace][pluginName] {
    /**
      * Function to tranform a value, this is an implementing class and thus
      * calls super.transform() like a mixin.
      *
      * @param value
      *  A value to perform a transformation upon.
      */
        testFunction(value) {
          this.value = super.transform(value);
        }
    });
};
