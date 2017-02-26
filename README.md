# Molotov: (Mix/Plug)-in loader for explosive composeability

## Install

`npm install --save molotov`

## Description

Molotov provides a series of tools that help modules with a uniform way to provide super classes and mixins for ["Real Mixins"](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/). Molotov also provides the ability to override mixin and supers via [config](https://www.npmjs.com/package/config) and the cocktail class from Molotov.


## Usage

### How to provide molotov style plugin supers and mixins to others (3 steps):

#### 1) Add a `.molotov.json` file to their module root to configure and document their molotov provider choices.

```js
// An example of the .molotov.json file for the scheme-punk project.
/**
 *  {
 *    "molotovPath": 'lib/molotov.js',  // The module path to your molotov.js implementing class.
 *    "schemePunk": { // An arbitrary name for your module's molotov name space.
 *      "supersNameSpacePaths": {  // SupersNameSpacePaths holds any number of super name spaces.
 *        "transform": "./transform/schemePunkTransform'", // transform is the name space. the value is the path to the transform super class.
 *        "source": "./source/schemePunkSource", // source is the name space, the value is the path to the source super class.
 *        "destination": "./destination/schemePunkDestination" // destination is the name space, the value is the path to the destination super class.
 *      },
 *      "molotovPlugins": { // molotov Plugins holds any number of super name spaces holding any number of plugins.
 *        "transform": { // this is a super name space that correlates to a super in the superNameSpacePaths.
 *          "tokenTemplateValuesMulti": // An descriptive arbitrary name chosen for this plugin.
 *            [  // Plugins will be chained in order Mixin2(Mixin3(superclass));
 *              "typeAdapter", // A file name of a mixin class .
 *              "tokenTemplateValues" // A file name of a mixin class.
 *            ]
 *        }
 *      }
 *    }
 *  }
 */

{
  "molotovPath": 'lib/molotov.js',
  "schemePunk": {
    "supersNameSpacePaths": {
      "transform": "./transform/schemePunkTransform'",
      "source": "./source/schemePunkSource",
      "destination": "./destination/schemePunkDestination"
    },
    "molotovPlugins": {
      "transform": {
        "tokenTemplateValuesMulti": [
          "typeAdapter",
          "tokenTemplateValues"
        ]
      }
    }
  }
}
```

#### 2) Write a Molotov implementing class in your module's classes.


Example: Write a molotov.js file at the path you indicated in `.molotov.json` at `molotovPath`

```js
// Contents of your molotov.js at lib/molotov.js

// Using config module with this module's default config.
const requireDirectory = require('require-directory');

// require the directory with all of your supers classes.
// THe directory will be organized with directories representing super name spaces
// and those directories will hold your supers classes. 
//  supersDirectory
//  |-- exampleSupersNameSpace
//  |-- | -- exampleSuperNameSpace.js
const supers = requireDirectory(module, './supersDirectory');

// require the directory with all of your mixins.
// THe directory will be organized with directories representing super name spaces
// and those directories will hold your mixins
//  plugins
//  |-- exampleSupersNameSpace
//  |-- | -- mixinOne.js
//  |-- | -- mixinTwo.js
const plugins = requireDirectory(module, './plugins');

// set the path to your .molotov.json molotov config file (see above)
const molotovPath = './.molotov.json';

// Require the molotov file from the molotov module.
// You will be extending this class.
const Molotov = require('molotov/molotov');

// By extending the molotov class you use the common molotov
// interface and provide your super and requires at require time.
// ensuring require caching.

// Also, by extending the molotov class and indicating the path
// in your .molotov.json file you allow other module writers
// to use or extend your plugins with their cocktail classes.

module.exports = const molotov = class extends Molotov {
  constructor(molotovPath, supers, plugins) {
    super(molotovPath, supers, plugins);
  }
}
//
```

Step 3: Use your molotov class in your Mixin Implementing classes.

```js
// example implementing factory class that returns an implementing class with a
// passed in superNameSPace and pluginName.

const Molotov = require('./lib/molotov'); // Path to your molotov class implementation.

module.exports = function implementFactory(superNameSpace, pluginName) {
const molotov = new Molotov();
  molotov.getMolotov()  // Ensures we get any superOverrides from config.
  .then((pluginMaker) => {
    // Get all of the molotov plugins for our module and any overrides from config.
    const molotovPlugins = pluginMaker.resolve();
    return molotovPlugins;
  })
  .then(
    returnedPlugins =>
      class exampleClassBase extends returnedPlugins[superNameSpace][pluginName] {
    /**
      * Function to tranform a value, this is an implementing class and thus
      * calls super.testFunction() like a mixin.
      *
      * @param value
      *  A value to perform a transformation upon.
      */
        testFunction(value) {
          // Calls to your first mixin and up the chain
          // if they also implement super.
          this.value = super.testFunction(value);
        }
    });
};
```

## How to override a molotov provider module through config and the molotov/cocktail class in your own module

### Example: Overriding a provider's super class:
* Set config in that molotov provider's namespace with a path to your super override class. 

To override the molotov provider module `scheme-punk`'s transform super class with my own custom transform super class I would modify the "scheme-punk" attribute inside of config/default to the following:
```
{
  "schemePunk": {
    "transform": {
      "superOverride": "/path/to/superNameSpaceItem/Override"
    }
  }
}
```
> Where, `schemePunk` is the molotov namespace for the scheme-punk module declared in the provider module's .molotov.json file and
`transform` is one of the supersNameSpacePaths keys also in the .molotov.json and the value above corresponds to the .js super class that I want to override the one defined in .molotov.json in the provider.

### Example: Overriding/Merging a provider's cocktail Loader.

Implementing modules can override existing cocktail mixin plugin definitions or define their own by:

#### 1) Extend or Invoke molotov/cocktail.js

#### 2) Provide a path to your custom cocktail implementation.
```
{
  "schemePunk": {
    "molotovPlugins": {
      "cocktailLoaders": [
        "path/to/mixinStylePluginLoader/implementing/cocktailClass"
      ]
    }
  }
}
```
