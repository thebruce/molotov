'use strict';

const _ = require('lodash');

module.exports = function pluginMaker(pluginsDirectoryObject, supers) {
  const plugins = {};
  Object.keys(pluginsDirectoryObject).forEach((directoryKey) => {
    Object.keys(pluginsDirectoryObject[directoryKey]).forEach((pluginKey) => {
      _.set(`plugins.${directoryKey}.${pluginKey}`,
        pluginsDirectoryObject[directoryKey][pluginKey](supers[directoryKey])
      );
    });
  });
  return plugins;
};
