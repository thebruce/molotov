// @flow

import type { molotovConfig, overrideConfig, supers, plugins, mixins } from './types/molotov';
import type Cocktail from './cocktail';

const SuperMixologist = require('./superMixologist');
const Polttopullo = require('./polttopullo');
const {
  MOLOTOV_CONFIG_REQUIRED,
  MOLOTOV_SUPERS_REQUIRED,
  MOLOTOV_PLUGINS_REQUIRED,
  MOLOTOV_MALFORMED_OVERRIDES,
  MOLOTOV_MALFORMED_COCKTAIL_ARRAY,
} = require('../_errors');

const {
  MolotovError,
} = require('./molotovError');

// Declarative version your `MolotovLoaderClass.`
// const supers = require('supersDirectory');
// const plugins = require('pathToPlugins');

// const Molotov = require('molotov');
// const molotov = Molotov(
//    molotovConfigObject,
//    'nameSpaceofYourModule',
//    supers,
//    plugins
// );
// module.exports = molotov;

// Then require your molotov in your classes.
// const molotov = require('pathToYourMolotovLoaderClass');

// And call 'getMolotov()'
// molotov.getMolotov().then(molotov => {
//   // Get all of the molotov plugins for our module.
//   const resolvedPlugins = molotov.getPlugins();
// })
const molotov = class Molotov {
  molotovConfig: molotovConfig
  molotovNameSpace: string
  mixins: mixins
  supers: supers
  plugins: plugins
  configOverrides: (overrideConfig | {})
  cocktails: (Array<?Cocktail>)

  /**
   * Create an instance of the molotov class. This class is meant
   *   to be extended by molotov plugin implementing modules.
   *
   * @param {molotovConfig} config
   *   A molotov configuration object.
   * @param {string} nameSpace
   *   THe namespace of your molotov implementing module.
   * @param {object} molotovSupers
   *   An object of Super classes keyed by the super name.
   * @param {object} molotovMixins
   *   An object of plugin classes keyed by supers name
   *   and then by the pluginName.
   *   {
   *     superClass: {
   *       pluginName: pluginClass
   *     }
   *   }
   * @param {object} configOverrides
   *   An object with the exact same shape as molotovConfig but
   *     meant as a place to pass through calling modules overrides
   *       to your molotov implementing configuration. Often used for
   *         dynamically or runtime assembled plugins.
   * @param {Cocktail} cocktails
   *   An array of cocktail classes used by modules using your molotov
   *   implementing module and providing their own plugins or supers.
   */
  constructor(config: molotovConfig, nameSpace: string, molotovSupers: supers, molotovMixins: mixins, configOverrides: (overrideConfig | {}) = {}, cocktails: Array<?Cocktail> = []) { // eslint-disable-line max-len
    if ((!config) || (typeof config !== 'object')) {
      throw new MolotovError(MOLOTOV_CONFIG_REQUIRED);
    }
    if ((typeof molotovSupers !== 'object')) {
      throw new MolotovError(MOLOTOV_SUPERS_REQUIRED);
    }
    if ((Object.keys(molotovMixins).length === 0) || (typeof molotovMixins !== 'object')) {
      throw new MolotovError(MOLOTOV_PLUGINS_REQUIRED);
    }
    if ((typeof configOverrides !== 'object')) {
      throw new MolotovError(MOLOTOV_MALFORMED_OVERRIDES);
    }
    if (!Array.isArray(cocktails)) {
      throw new MolotovError(MOLOTOV_MALFORMED_COCKTAIL_ARRAY);
    }
    this.setNameSpace(nameSpace);
    this.setMolotovConfig(config);
    this.setSupers(molotovSupers);
    this.setMixins(molotovMixins);
    this.setConfigOverrides(configOverrides);
    this.setCocktails(cocktails);
  }

  /**
   * Sets the mixins for this molotov.
   *   Mixins are used to compose plugins.
   *
   * @param {mixins} mixinObj
   *   An object of mixin classes keyed by super name
   *   and then mixin name with a value of the corresponding
   *   mixin class.
   *
   * @returns {void}
   */
  setMixins(mixinObj: mixins): void {
    this.mixins = mixinObj;
  }

  /**
   * Returns the mixins for this molotov.
   *
   * @returns {mixins}
   *   An object of mixin classes keyed by super name
   *   and then mixin name with a value of the corresponding
   *   mixin class.
   */
  getMixins(): mixins {
    return this.mixins;
  }

  /**
   * Sets the config for this molotov.
   *
   * @param {molotovConfig} config
   *   A configuration object providing super names
   *     for relevant namespaces and plugin mixin composition.
   *
   * @returns {void}
   */
  setMolotovConfig(config: molotovConfig): void {
    this.molotovConfig = config;
  }

  /**
   * Gets the config for this molotov.
   *
   * @returns {molotovConfig}
   *   A configuration object holding super names
   *    and plugin mixin composition.
   */
  getMolotovConfig(): molotovConfig {
    return this.molotovConfig;
  }

  /**
   * Sets the plugin classes for this molotov.
   *
   * @param {plugins} plugs
   *   An object keyed by supers name's and then
   *   keyed by plugin names with values of mixin
   *   classes or pre-mixed mixin classes.
   *
   * @returns {void}
   */
  setPlugins(plugs: plugins): void {
    this.plugins = plugs;
  }

  /**
   * Gets the plugin object for this molotov.
   *
   * @returns {plugins}
   *   An object keyed by supers name's and then
   *   keyed by plugin names with values of mixin
   *   classes or pre-mixed mixin classes.
   */
  getPlugins(): plugins {
    return this.plugins;
  }

  /**
   * Sets the super classes for this molotov.
   *
   * @param {supers} supersObj
   *   An object keyed by supers names with
   *   super classes values.
   *
   * @returns {void}
   */
  setSupers(supersObj: supers): void {
    this.supers = supersObj;
  }

  /**
   * Returns the super classes object for this molotov.
   *
   * @returns {supers}
   *   An object keyed by supers names with
   *   super classes values.
   */
  getSupers(): supers {
    return this.supers;
  }

  /**
   * Mixes supers with the superMixologist class
   * ensuring that we get any overridden supers
   * from passed cocktail classes. And unifying
   * their interface. After this our supers will be
   * ready to combine with plugins for *REAL* mixins.
   *
   * @returns {supers}
   *   Returns supers with overrides from cocktail classes.
   *
   */
  mixSupers(): supers {
    const superMixologist = new SuperMixologist(this);
    superMixologist.resolve();
    return superMixologist;
  }

  /**
   * Mixes a molotov cocktail
   *   for this molotov. The PolttoPullo class
   *   is ready to be resolved incorporating
   *   Cocktail classes and overriden plugin
   *   composition.
   *
   * @returns {Polttopullo}
   *   A mixed PolttoPullo plugins class ready
   *   to be resolved (polttopull.resolve().then((res) => // use away))
   */
  getMolotov(): Polttopullo {
    const resolvedSupers = this.mixSupers();
    return new Polttopullo(resolvedSupers.molotov);
  }

  /**
   * Sets the namespace for this molotov use.
   *
   * @param {string} nameSpace
   *   The namespace of the module implementing molotov.
   *   This will be used to interpret configuration passed
   *   in molotov config.
   *
   * @returns {void}
   */
  setNameSpace(nameSpace: string): void {
    this.molotovNameSpace = nameSpace;
  }

  /**
   * Get the namespace string for this molotov implementation.
   *
   * @returns {string}
   *   The namespace of this molotov implementation.
   */
  getNameSpace(): string {
    return this.molotovNameSpace;
  }

  /**
   * Sets any config overrides for this molotov implementation.
   *   Usually reserved for any dynamic plugin compositions or
   *   for modules implementing a molotov implementer with
   *   plugin composition overrides.
   *
   * @param {(overrideConfig | {})} overrides
   *   Configuration overrides for this molotov instance. These will
   *   override existing configuration in the passed in molotovConfig.
   *
   * @returns {void}
   */
  setConfigOverrides(overrides: (overrideConfig | {})): void {
    this.configOverrides = overrides;
  }

  /**
   * Gets configuration overrides for this molotov.
   *
   * @returns {(overrideConfig | {})}
   *   Configuration overrides for this molotov instance. These will
   *   override existing configuration in the passed in molotovConfig.
   */
  getConfigOverrides(): (overrideConfig | {}) {
    return this.configOverrides;
  }

  /**
   * Sets the array of Cocktail classes for this molotov.
   *
   * @param {((Cocktail[] | []))} cocktails
   *   An array of cocktail classes to be used by modules
   *   utilizing molotov implementing modules to override
   *   or provide additional supers, mixins, and plugin
   *   definitions.
   *
   * @returns {void}
   */
  setCocktails(cocktails: Array<?Cocktail>): void {
    this.cocktails = cocktails;
  }
  /**
   * Gets the Cocktail array for this molotov.
   * It's martini time!
   * .---------.'---.
   * '.       :    .'
   *   '.  .:::  .'
   *     '.'::'.'
   *       '||'
   *        ||
   *        ||
   *        ||
   *    ---====---
   *
   * @returns {((Cocktail[] | []))} cocktails
   *   An array of cocktail classes to be used by modules
   *   utilizing molotov implementing modules to override
   *   or provide additional supers, mixins, and plugin
   *   definitions.
   *
 */
  getCocktails(): Array<?Cocktail> {
    return this.cocktails;
  }
};

module.exports = molotov;
