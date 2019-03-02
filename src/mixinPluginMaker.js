// @flow

import type { pluginsList, mixins, plugins, supers } from './types/molotov';

const _ = require('lodash');

const { MolotovError } = require('./molotovError');

const {
  MOLOTOV_PLUGIN_MAKER_NO_SUPER_WITH_THIS_NAME,
  MOLOTOV_PLUGIN_MAKER_PLUGIN_CANT_FIND_MIXIN,
} = require('../_errors');

/**
 * pluginMaker
 *   Produces a plugin object keyed by supersNameSpace which is an
 *   object keyed by pluginName containing the plugin class with
 *   the super class (of the superNameSpace) as an argument.
 *
 * @param {pluginList} pluginsDefinitions
 *   An object keyed by superNames, then plugin names holding arrays
 *   of mixins by the names defined in a molotov implementing modules
 *   plugins exports. Usually passed in molotov config under
 *   the key "molotovPlugins";
 * @param {mixins} pMMixins
 *   A pluginsDirectoryObject represents a molotov plugin directory.
 *   By convention a plugin directory is organized by sub-directories
 *   named after super class name spaces. Within the super class named
 *   plugin directories are plugins for use with that super class. The
 *   pluginsDirectoryObject is an object created from requireDirectory
 *   which an object of required files keyed by directory structure and
 *   file name.
 * @param {supers} pMSupers
 *  Supers is an object keyed by superNameSpaces with their related
 *  super class as a value.
 *
 *  @returns {plugins} plugins
 *   Returns an object keyed by superNameSpaces and then by pluginName
 *   with mixin class values.
 */
module.exports = function pluginMaker(
  pluginsDefinitions: pluginsList,
  pMMixins: mixins,
  pMSupers: supers
): plugins {
  // eslint-disable-line max-len
  const resolvedPlugins = {};

  // Plugin directories are structured in folders named
  // after the super namespaces.
  Object.keys(pluginsDefinitions).forEach(directoryKey => {
    // If a plugin definition asks for a super we don't have.
    // This is a problem.
    if (!_.has(pMSupers, directoryKey)) {
      throw new MolotovError(MOLOTOV_PLUGIN_MAKER_NO_SUPER_WITH_THIS_NAME);
    }
    // Each key below the superNameSpace directory key will be a plugin name
    Object.keys(pluginsDefinitions[directoryKey]).forEach(pluginKey => {
      // Check to see that we have these mixins in our mixins object.
      // If we have different mixins indicated than the ones we have.
      // This is a problem.
      if (
        _.intersection(
          Object.keys(pMMixins[directoryKey]),
          pluginsDefinitions[directoryKey][pluginKey]
        ).length <= 0
      ) {
        // eslint-disable-line max-len
        throw new MolotovError(MOLOTOV_PLUGIN_MAKER_PLUGIN_CANT_FIND_MIXIN);
      }
      const tmpMixinArray = _.reverse(
        _.cloneDeep(pluginsDefinitions[directoryKey][pluginKey])
      );
      const superClass = pMSupers[directoryKey];

      // Mixins follow a pattern like this: Mixin2(Mixin3(superclass));
      const mixinShaker = tmpMixinArray.reduce(
        (mixClass, mixin) => pMMixins[directoryKey][mixin](mixClass),
        superClass
      );
      _.set(resolvedPlugins, `${directoryKey}.${pluginKey}`, mixinShaker);
    });
  });
  return resolvedPlugins;
};
