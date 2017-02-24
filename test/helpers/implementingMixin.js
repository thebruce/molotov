// Using config module with this module's default config.

// require supers.

// require plugins.

const molotov = require('../../molotov');

/**
 * SchemePunkTransformBase function returns a class object that when supplied
 * with a plugin returns a mixin class or without a plugin a base class.
 *
 * @param  obj options
 *  An options object with a key name in options.plugin.
 * @return object
 *   A schemePunkTransformBase class.
 */
module.exports = function implementFactory(plugins, superNameSpace, pluginName) {
  molotov.getMolotov().then((newMolotov) => {
    // Get all of the molotov plugins for our module.
    const molotovPlugins = newMolotov.exportPlugins();
    return molotovPlugins;
  })
  .then(
    returnedPlugins =>
      class schemePunkTransformBase extends returnedPlugins[superNameSpace][pluginName] {
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

