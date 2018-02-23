'use strict';

const _ = require('lodash');

/**
 * pluginMaker
 *   Produces a plugin object keyed by supersNameSpace which is an
 *   object keyed by pluginName containing the plugin class with
 *   the super class (of the superNameSpace) as an argument.
 *
 * @param {object} pluginsDefinitions
 *   An object keyed by superNames, then plugin names holding arrays
 *   of mixins by the names defined in a molotov implementing modules
 *   plugins exports.
 * @param {obj} pluginsDirectoryObject
 *   A pluginsDirectoryObject represents a molotov plugin directory.
 *   By convention a plugin directory is organized by sub-directories
 *   named after super class name spaces. Within the super class named
 *   plugin directories are plugins for use with that super class. The
 *   pluginsDirectoryObject is an object created from requireDirectory
 *   which an object of required files keyed by directory structure and
 *   file name.
 * @param {obj} supers
 *  Supers is an object keyed by superNameSpaces with their related
 *  super class as a value.
 * @param {obj} dynamicPlugins
 *  Dynamic plugins are the same shape as pluginsDefinitions but are meant to
 *  be passed through in an implementing modules' polotpullo instance
 *  resolved from molotov.getMolotov(). The intention is that these can be
 *  assembled dynamically and passed to the implementing class before
 *  resolving or overriding plugins. ex:
 *  molotov.getMolotov().then(pluginMaker =>
 *   pluginMaker.resolve(dynamicPlugins))
 *
 *  @returns {obj} plugins
 *   Returns an object keyed by superNameSpaces and then by pluginName
 *   with mixin class values.
 */
module.exports = function pluginMaker(pluginsDefinitions, pluginsDirectoryObject, supers, dynamicPlugins = {}) {  // eslint-disable-line max-len
  const plugins = {};
  let mergedPlugins = {};
  mergedPlugins = _.merge(mergedPlugins, pluginsDefinitions, dynamicPlugins);

  // Plugin directories are structured in folders named
  // after the super namespaces.
  Object.keys(mergedPlugins).forEach((directoryKey) => {
    // Each key below the superNameSpace directory key will be a plugin file.
    Object.keys(mergedPlugins[directoryKey]).forEach((pluginKey) => {
      const tmpPluginArray = _.reverse(
        _.cloneDeep(
          mergedPlugins[directoryKey][pluginKey]
        )
      );
      const superClass = supers[directoryKey];

      // Mixins follow a pattern like this: Mixin2(Mixin3(superclass));
      const dumpy = tmpPluginArray.reduce(
        (mixClass, mixin) => pluginsDirectoryObject[directoryKey][mixin](mixClass),
        superClass
      );
      _.set(
        plugins,
        `${directoryKey}.${pluginKey}`,
        dumpy
      );
    });
  });
  return plugins;
};
