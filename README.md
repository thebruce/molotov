# Molotov: (Mix/Plug)-in loader for explosive composeability

## Install

`npm install --save molotov`

## Description

Molotov provides a series of tools that help modules with a uniform way to provide super classes and mixins for ["Real Mixins"](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/). Molotov also provides the ability to override mixin and supers via [config](https://www.npmjs.com/package/config) and the cocktail class from Molotov.


## Usage

### To provide molotov style plugin supers and mixins to others (3 steps):

#### 1) Add a `.molotov.json` file to their module root to configure and document their molotov provider choices.

```js
// An example of the .molotov.json file for the scheme-punk project.

{
  "molotov": {
    "providers": {
      "scheme-punk": {
        "configNameSpace": "schemePunk",
        "supersNameSpacePaths": {
          "transform": "./transform/schemePunkTransform'",
          "source": "./source/schemePunkSource",
          "destination": "./destination/schemePunkDestination"
        }
      }
    }
  }
}
```

#### 2) Implement superMixologist to provide super classes for your module.

#### Implement SuperMixologist Example:

```js
// This approach will load up your super classes from your molotov config.
// Require the superMixologist Class.
const SuperMixologist = require('molotov/superMixologist');

// Create an instance of that class.
const superMixologist = new SuperMixologist(pathFolderContainingMolotovConfig);

// Populate your supers from your molotov config and integrate any user overrides of your supers.
const providerSupers = superMixologist.resolveSupers();

/* If we use the example .molotov.json file above provideSupers will be
 *  an object keyed by superNameSpace as designated in the molotov config
 * with a value of the required super class:
 *  {
 *    "transform": FUNCTION [schemePunkTransform],
 *    "source": FUNCTION [schemePunkSource],
 *    "destination": FUNCTION [schemePunkDestination]
 *  }
 */
```

#### Implement SuperMixologist Example 2:
```js
// This approach requires your supers ahead of time and passes them in.
// You might choose to do this to keep your requires declarative and at require time.
const supers = {
  transform: require('./transform/schemePunkTransform'),
  source: require('./source/schemePunkSource'),
  destination: require('./destination/schemePunkDestination')
}

// Require the superMixologist Class.
const SuperMixologist = require('molotov/superMixologist', supers);

// Create an instance of that class.
const superMixologist = new SuperMixologist(pathFolderContainingMolotovConfig, supers);

// Populate your supers from your molotov config and integrate any user overrides of your supers.
const providerSupers = superMixologist.resolveSupers();

/* If we use the example .molotov.json file above provideSupers will be
 *  an object keyed by superNameSpace as designated in the molotov config
 * with a value of the required super class:
 *  {
 *    "transform": FUNCTION [schemePunkTransform],
 *    "source": FUNCTION [schemePunkSource],
 *    "destination": FUNCTION [schemePunkDestination]
 *  }
 */
```

#### 3) Implement (or extend) molotov.js with a custom Molotov implementation OR call molotov.js and pass the appropriate parameters.
```

```


## To override a molotov provider module through config and the molotov/cocktail class in your own module


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
    "molotov": {
      "cocktailLoaders": [
        "path/to/mixinStylePluginLoader/implementing/cocktailClass"
      ]
    }
  }
}
```
