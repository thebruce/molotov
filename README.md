# Molotov: (Mix/Plug)-in loader for explosive composeability

[![Build Status](https://travis-ci.org/thebruce/molotov.svg?branch=master)](https://travis-ci.org/thebruce/molotov) [![Coverage Status](https://coveralls.io/repos/github/thebruce/molotov/badge.svg)](https://coveralls.io/github/thebruce/molotov) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Greenkeeper badge](https://badges.greenkeeper.io/thebruce/molotov.svg)](https://greenkeeper.io/)

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
{
  // The module path to your molotov.js implementing class.
  "molotovPath": 'lib/molotov.js',
  // An arbitrary name for your module's molotov name space.
  "schemePunk": {
  // SupersNameSpacePaths holds any number of super name spaces.
    "supersNameSpacePaths": {
      // transform is the name space. the value is the path to the
      // transform super class.
      "transform": "./transform/schemePunkTransform'",
      // source is the name space, the value is the path to the
      // source super class
      "source": "./source/schemePunkSource",
      // destination is the name space, the value is the path to
      // the destination super class
      "destination": "./destination/schemePunkDestination" .
    },
    // molotov Plugins holds any number of super name spaces holding
    // any number of plugins.
    "molotovPlugins": {
    // this is a super name space that correlates to a super in the
    // superNameSpacePaths.
    "transform": {
      // this is a super name space that correlates to a super in the
      // superNameSpacePaths.
      "tokenTemplateValuesMulti":
        // Plugins will be chained in order Mixin1(Mixin2(superclass));
        [
          "typeAdapter", // A file name of a mixin class.
          "tokenTemplateValues" //A file name of a mixin class.
        ]
      }
    }
  }
}
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
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your supers classes.
//  supersDirectory
//  |-- exampleSuperNameSpace.js
const supers = requireDirectory(module, './supersDirectory');

// require the directory with all of your mixins.
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your mixins
//  plugins
//  |-- exampleSupersNameSpace
//  |-- | -- mixinOne.js
//  |-- | -- mixinTwo.js
const plugins = requireDirectory(module, './plugins');

// set the path to your .molotov.json molotov config file
// (see above) from your
// modules root.
const molotovPath = './';

// Require the molotov file from the molotov module.
// You will be extending this class.
const Molotov = require('molotov/molotov');

const molotovNameSpace = 'schemePunk';

// Load in an config for your module. Perhaps from the excellent config module.
// Or however you want to pass in configuration details, can also pass
// an empty object.
const config = {};

// By extending the molotov class you use the common molotov
// interface and provide your super and requires at require time.
// ensuring require caching.

// Also, by extending the molotov class and indicating the path
// in your .molotov.json file you allow other module writers
// to use or extend your plugins with their cocktail classes.

module.exports = class extends Molotov {
  constructor() {
    super(molotovPath, molotovNameSpace, supers, plugins, config);
  }
}
//
```

Step 3: Use your molotov class in your Mixin Implementing classes.

```js
// example implementing factory class that returns an
// implementing class with a passed in superNameSPace and
// pluginName.

// Path to your molotov class implementation.
const Molotov = require('./lib/molotov');

module.exports = function implementFactory(superNameSpace, pluginName) {
const molotov = new Molotov();
  // Ensures we get any superOverrides from config.
  molotov.getMolotov()
  .then((pluginMaker) => {
    // Get all of the molotov plugins for our module and
    // any overrides from config.
    const molotovPlugins = pluginMaker.resolve();
    return molotovPlugins;
  })
  .then(
    returnedPlugins =>
      class exampleClassBase extends returnedPlugins[superNameSpace][pluginName] {
    /**
      * Function to tranform a value, this is an implementing
      * class and thus
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

### How to override a molotov provider's super classes.

#### 1: Modify your config file:
1)  Set config in that molotov provider's namespace with a path to your super override class.

```js
// For example to override the molotov provider module
// `scheme-punk`'s transform super class with my own custom
// transform super class I would create a config object at the
// the SchemePunk module's molotov namespace and names supers.

{
  "schemePunk": {
    "transform": {
      "superOverride": "/path/to/superNameSpaceItem/yourSuperClassOverride"
    }
  }
}


// Where, `schemePunk` is the molotov namespace for the
// scheme-punk module declared in the provider module's .molotov.json
// file and `transform` is one of the supersNameSpacePaths keys also
// in the .molotov.json and the value above corresponds to the .js super
// class that I want to override the one defined in .molotov.json
// in the provider.

```
#### 2: Ensure you have a super class at that path that conforms to the interface set in the molotov provider's super.


#### 3: Load this created config in your implementing molotov class:
```js
const config = {
  schemePunk: {
    transform: {
      superOverride: '/path/to/superNameSpaceItem/yourSuperClassOverride'
    }
  }
};
```


### How to override a molotov provider's plugin definitions with Cocktail without using config.

#### 1) Extend the cocktail class with a custom cocktail class for your module.
```js
// Our cocktail extension class.
const path = require('path');
const requireDirectory = require('require-directory');
const config = require('config');
const SchemePunkMolotov = require('scheme-punk/molotov');
const molotov = new SchemePunkMolotov();

const yourNameSpacedConfigChanges = {
  "schemePunk": {
    "molotovPlugins": [
      "/test/"
    ]
  }
}

molotov.setConfig(yourNameSpacedConfigChanges); // Set your config in the molotov item.

// Define you plugin object keyed by supersNameSpace
// for the molotov object you have.
// And then by plugin name with mixin file names as values.
const pluginDefinitions = {
  transform:{
    tokenTemplateValues: [
      "objectKeysTransform",
      "typeAdapter",
      "tokenTemplateValues"
    ]
  };

// Now require cocktail and its classes.
const Cocktail = require('../cocktail');

module.exports = class extends Cocktail {
  constructor() {
    super(molotov, pluginDefinitions);
  };
}

// Now the molotov provider module you have overriden will
// use your plugin definition overrides on its plugin offerings.
```

### How to add additional plugins and plugin definitions to a molotov provider with Cocktail.

#### 1) Modify your `config/default.json` or other config module configuration approach to provide a path to your cocktail loader:
```js
// config with cocktail loader.
{
  "schemePunk": {
    "molotovPlugins": [
      "/test/myClassThatExtendsCocktail"
    ]
  }
}
```

#### 2) Add your plugin override definitions in your config at `molotov.cocktailPlugins`
```js
// cocktailPlugin definitions.
// Config with cocktail loader.
// The molotov.cocktailPlugins below defines an override for:
// Provider Name Space: schemePunk
// SupersnameSpace: transform
// plugin Name[0]: tokenTemplateValues -> in this case,
// an existing plugin in scheme punk
// that we want to override by adding an additional mixin to the plugin..
// plugin Name[1]: tokenTemplatesMultiFromObject -> a new plugin
// created from existing mixins
// plugin Name[0]: magicSnap -> a new plugin created from a new mixin.
{
  "schemePunk": {
    "molotovPlugins": [
      "/test/myClassThatExtendsCocktail"
    ]
  },
  "molotov": {
    "cocktailPlugins": {
      "schemePunk": {
        "transform":{
          "tokenTemplateValues": [
            "objectKeysTransform",
            "typeAdapter",
            "tokenTemplateValues"
          ],
          "tokenTemplatesMultiFromObject": [
            "typeAdapter",
            "tokenTemplateValues"
          ],
          "magicSnap": [
            "typeAdapter",
            "magicSnap"
          ]
        }
      }
    }
  }
}
```

#### 3) Extend the cocktail class with a custom cocktail class for your module.
```js
// Our cocktail extension class.
const path = require('path');
const requireDirectory = require('require-directory');
const config = require('config');
const SchemePunkMolotov = require('scheme-punk/molotov');
const molotov = new SchemePunkMolotov();

// require the directory with all of my cocktail plugins
// THe directory will be organized with directories representing
// super name spaces and those directories will hold your mixins.
// For the above config it would follow:
//  ./plugins
//  |-- transform
//  |-- | -- magicSnap.js
const myModulePluginsDirectory = requireDirectory('./plugins');


// Now require cocktail and its classes.
const Cocktail = require('../cocktail');

module.exports = class extends Cocktail {
  constructor() {
    super(molotov, '', myModulePluginsDirectory);
  }
}
```



### How to override and add additional plugins and plugin definitions with your custom overriding supers with Cocktail.

#### 1) Modify your `config/default.json` or other config module configuration approach to provide a path to your cocktail loader:
```js
// config with cocktail loader.
{
  "schemePunk": {
    "molotovPlugins": [
      "/test/MyClassthatImplementsCocktail" // Path to a cocktail class I have written or will write.
    ]
  }
}
```

#### 2) Add your plugin override definitions in your config at `molotov.cocktailPlugins`
```js
// cocktailPlugin definitions.
// Config with cocktail loader.
// The molotov.cocktailPlugins below defines an override for:
// Provider Name Space: schemePunk
// SupersnameSpace: transform
// plugin Name[0]: tokenTemplateValues -> in this case,
// an existing plugin in scheme punk
//   that we want to override by adding an additional mixin
// to the plugin..
// plugin Name[1]: tokenTemplatesMultiFromObject -> a
// new plugin created from existing mixins
// plugin Name[0]: magicSnap -> a new plugin created from a new mixin.
{
  "schemePunk": {
    "molotovPlugins": [
      "/test/MyClassthatImplementsCocktail"
    ],
    "transform": {
      "superOverride": "/path/to/superNameSpaceItem/yourSuperClassOverride"
    }
  },
  "molotov": {
    "cocktailPlugins": {
      "schemePunk": {
        "transform":{
          "tokenTemplateValues": [
            "objectKeysTransform",
            "typeAdapter",
            "tokenTemplateValues"
          ],
          "tokenTemplatesMultiFromObject": [
            "typeAdapter",
            "tokenTemplateValues"
          ],
          "magicSnap": [
            "typeAdapter",
            "magicSnap"
          ]
        }
      }
    }
  }
}
```

#### 3) Extend the cocktail class with a custom cocktail class for your module.
```js
// Our cocktail extension class.
// Will match the path we set in step 1
// /test/MyClassthatImplementsCocktail.js
const path = require('path');
const requireDirectory = require('require-directory');
const config = require('config');
const SchemePunkMolotov = require('scheme-punk/molotov');
const molotov = new SchemePunkMolotov();

// To ensure we have a speedy supers loadup we will require it here,
//  even though it is in config. For that we will needs a
// valid supers object.
const myModuleSupersOverrides = {
  transform: require('/path/to/superNameSpaceItem/yourSuperClassOverride');
};


// require the directory with all of my cocktail plugins
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your mixins. For the above
// config it would follow:
//  ./plugins
//  |-- transform
//  |-- | -- magicSnap.js
const myModulePluginsDirectory = requireDirectory('./plugins');


// Now require cocktail and its classes.
const Cocktail = require('../cocktail');

module.exports = class extends Cocktail {
  constructor() {
    super(molotov, '', myModulePluginsDirectory, myModuleSupersOverrides);
  }
}
```
