# Molotov: A "Real Mixin" Manager

[![Build Status](https://travis-ci.org/thebruce/molotov.svg?branch=master)](https://travis-ci.org/thebruce/molotov) [![Coverage Status](https://coveralls.io/repos/github/thebruce/molotov/badge.svg)](https://coveralls.io/github/thebruce/molotov) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Greenkeeper badge](https://badges.greenkeeper.io/thebruce/molotov.svg)](https://greenkeeper.io/)

## Install

`npm install --save molotov` or `yarn add molotov`

## Description

Molotov is a mixin manager that provides a uniform approach to using ["Real Mixins"](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) for class composition. It also encourages thoughtful mixin design and management by enforcing the idea of mixin layers. For a description of mixin layers see: ["Implementing layered designs with mixin layers"](https://yanniss.github.io/templates.pdf). 

## Why use a mixin manager?

The process of using "Real Mixins" in node.js as describe in Justin Fagnani's [blog post](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) relies on "subclass factories, parameterized by the superclass" which is in fact the exact same language used in the [white paper](https://yanniss.github.io/templates.pdf) on mixin layers above. 

In Node.js that looks like:
```js
Mixin = (superclass) => class extends superclass { // your mixin code };
```

This is great and can easily be implemented anywhere you need mixins. Mr Fagnani even wrote a package to help you quickly and reliably create and introspect mixins (see [mixwith](https://github.com/justinfagnani/mixwith.js)).

Even having both simple use and good tooling covered I found that implementing the "Real Mixin" pattern in several projects left me writing very similar code in an effort to bring organization and understanding to the sometimes confusing world of compositional capabilities.

From that experience molotov was born - a way to organize use of Real Mixins for packages.

Using Molotov Mixin Manager will:

1) Provide an organized way to declare a mixin layer, or group of mixins meant to work together under a encompassing super class as an application.
2) Reduce repetitive code needed to setup and create mixins
3) Provide a way for users to override and supplement your mixins and supers with custom functionality or dynamic composition of mixin layers.
4) Encourage operation control by organizing mixins within parameterizing super and base class implementers.

## Two ways to use Molotov

1) Use and provide extendible "Real Mixins" with mixin layers named "plugins" in your package

2) Override or extend a package that uses Molotov to provide "Real Mixins" with your own custom plugin definitions, mixins and or supers via Molotov's Cocktail class.

## Usage

After setting up molotov (steps provided below) you can access all of your mixin layers (groups of mixins meant to work together as an application) by the parameterizing super class they relate to with this call:

```js
molotov.getMolotov().resolve();  // Returns mixed in mixins with their supers keyed by their plugin name organized by supers class name.
```

### Molotov: How to to provide "Real Mixins" in your package: (4 steps)

1) Create your supers classes and mixins.
2) Create configuration for your package's use of Molotov.
3) Create a molotov.js file that implements the molotov class.
4) Use your molotov class within a super/mixin's implementer class.

#### Step 1: Create your supers classes and mixins

This step involves creating your supers classes and mixins. Do read the post [Real Mixins](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) for a good explanation of how "Real Mixins: work in node.js. 

Step 1A - Your Supers:

* Your supers need to export a class that does something. According to "Real Mixins" these will be the final stopping point when we use a super call. Essentially this is the basic interface for the class that you will extend with mixins.

* The end goal for your supers classes is to be passed to your molotov.js file you will create in step 3 as an object.

* The keys of that supers object you pass will be the supers name and the value will be the supers class.

* If you are creating your supers classes as individual files with exports you could create an index file to export all of them into an object.

  * Let's look at an example of this from [SchemePunk](https://github.com/schemepunk/scheme-punk/blob/master/lib/supers/index.js) which is a molotov implementer package:

```js
// Schemepunk is a molotov implementing package.

// this code show here is in a file located in @schemepunk/scheme-punk/lib/supers/index.js

// The structure of this folder is as follows:
// | supers
//   - index.js
//   - destination.js
//   - source.js
//   - transform.js

// In schemepunk We have 3 supers classes.
// We will require them
const destination = require('./destination');
const source = require('./source');
const transform = require('./transform');

// And we will export them in an object to be required
// in the molotov.js file to be created in step 2 below.
module.exports = {
  destination,
  source,
  transform
};
```

Step 1B - Your Mixins:

* Your mixins need to export a function that returns a class that extends the passed in superclass, i.e. `module.exports = superclass => class extends superclass {`

* Lets look at an example from the [SchemePunk](https://github.com/schemepunk/scheme-punk/blob/master/lib/plugins/transform/prependValues.js) package:

```js
// This is a mixin for the transform super interface.
const _ = require('lodash');

module.exports = superclass => class extends superclass {
  /**
   * Function to transform a value by prepending a string to a key, array member
   * or string. This.options will need a prependValue in order to work with
   * this transform.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  transform(value) {
    const prependValue = _.get(this, 'options.sourcePrepend', '');
    // Call super.transform and pass along the new value to honor composition.
    return super.transform(`${prependValue}${value}`);
  }
};
```

* The end goal for your mixin classes is to be formed into mixinLayers or named specific combinations of mixins in particular orders. These mixinLayers are called plugins in molotov. These are defined as an array of mixins and named in step 2.

* Plugins in molotov act as along the same principals outlined in the whitepaper [Implementing Layered Designs with Mixin Layers](https://yanniss.github.io/templates.pdf), that is: "A mixin layer can be viewed as a mixin class encapsulating other mixins with the restriction that the parameter (superclass) of an outer mixin must encapsulate all parameters of inner mixins."

* The keys of that mixins object you pass to your molotov class in step 3 will be the supers name's and the value will be an object keyed by mixin name's containing the correlating mixin names class. Don't worry about plugins quite yet that will happen in step 2.

* If you are creating your mixins classes as individual files with exports you could create an index file to export all of them into an object.

  * Let's look at an example of this from [SchemePunk](https://github.com/schemepunk/scheme-punk/blob/master/lib/plugins/index.js) which is a molotov implementer package:

```js
// Schemepunk is a molotov implementing package.

// The structure of this folder is as follows:
// | plugins
//   - index.js
//   - | destnation
//   -   -- {a number of destination plugins}
//   - | source
//   -   -- {a number of source plugins}
//   - | transform
//   -   -- {a number of transform plugins}

// In schemepunk We have many mixins
// We will require them

const concatIntoDestination = require('./destination/concatIntoDestination');
const destroyDestination = require('./destination/destroyDestination');
const mergeIntoDestination = require('./destination/mergeIntoDestination');
const pushDestination = require('./destination/pushDestination');
const activeSchemeSource = require('./source/activeSchemeSource');
const jsonTemplateFileSource = require('./source/jsonTemplateFileSource');
const originalSchemeSource = require('./source/originalSchemeSource');
const appendValues = require('./transform/appendValues');
const delimitValues = require('./transform/delimitValues');
const filterAttributes = require('./transform/filterAttributes');
const objectKeysTransform = require('./transform/objectKeysTransform');
const prependValues = require('./transform/prependValues');
const regexWordBoundariesValues = require('./transform/regexWordBoundariesValues');
const tokenTemplateValues = require('./transform/tokenTemplateValues');
const typeAdapter = require('./transform/typeAdapter');

// Now we form an object keyed by Suoer name
// This corresponds to the super class the mixin conforms towards.
// The supers key contains an object keyed by  mixin name with a value of the mixin function class export.

const plugins = {
  destination: {
    concatIntoDestination,
    destroyDestination,
    mergeIntoDestination,
    pushDestination
  },
  source: {
    activeSchemeSource,
    jsonTemplateFileSource,
    originalSchemeSource
  },
  transform: {
    appendValues,
    delimitValues,
    filterAttributes,
    objectKeysTransform,
    prependValues,
    regexWordBoundariesValues,
    tokenTemplateValues,
    typeAdapter
  }
};

module.exports = plugins;
```

#### Step 2: Create configuration for your package's use of Molotov

This step is where you define your supers classes names and also plugins or mixin layers inside of a configuration object. This configuration object will be passed along to molotov by your package in your molotov extending class in step 3.

The configuration object has 2 keys you need to be aware of `supersNameSpace` and `molotovPlugins`. 

The `supersNameSpace` key holds am object keyed by names you decide upon for your supers. These names must conform to the supersNameSpace keys in the mixin object you created in step 1. The values of those supersNameSpace keys are the keys in the supersObject. This gives you the flexibility to have multiple SupersNameSpace names assigned to the same class or a differently named supersNameSpace then the key of the superClass in the Supers object that is passed to molotov. The real benefit of this will be to packages that use your molotov implementing package in how they override or route your or their named supers to these supersNameSpaces.

The `molotovPlugins` key holds an object with keys that are the supersNameSpaces keys in the `supersNameSpace` object. This aligns plugins with their related supers per the mixin layer idea of the final super mixin encompassing the parameterization of all inner mixins. Each supers key is another object which is keyed by plugin name. These are arbitrary and up to you - these will be used when calling your package to achieve a particular "application" of mixins. Each pluginName key has a value of an array of mixin names. These mixin names correlate to the keys of the mixin classes in your mixins object you created in step 1. The order of the mixins is significant. The mixin in the first position of the array will pass along any calls to super to the mixin class in the next position of the array. If there are no other mixins after that mixin it will then go to the supers class represented by the supersNameSpace which the pluginKey is under.

Let's look at a [configuration file from schemepunk](https://github.com/schemepunk/scheme-punk/blob/master/lib/molotov.json):

```js
{
  schemePunk: {
    supersNameSpace: {  // This is our supersNameSpace. Again in schemepunk we have 3 supers.
      transform: "transform", // Keys are the superNameSpace name and values are the key of the class in the supers object you created in step 1.
      source: "source",
      destination: "destination"
    },
    molotovPlugins: { // These are the molotovPlugins or mixin layers.
      destination: { // molotovPlugins are grouped by supersNameSpace to which they relate.
        destroyDestination: [ // Each plugin has a name.
          "destroyDestination" // Plugins are composed of mixins. These strings are the keys of the mixins classes in the mixins object you created in step 1.
        ],
        pushDestination: [
          "pushDestination" // Any calls to super within a mixin will go to the super in the chain. In this case since we only have 1 mixin to the destination super class indicated by the superNameSpace "destination".
        ],
        mergeIntoDestination: [
          "mergeIntoDestination"
        ],
        concatIntoDestination: [
          "concatIntoDestination"
        ]
      },
      source: {
        originalSchemeSource: [
          "originalSchemeSource"
        ],
        activeSchemeSource: [
          "activeSchemeSource"
        ],
        jsonTemplateFileSource: [
          "jsonTemplateFileSource"
        ]
      },
      transform: {
        appendValuesAdapter: [ // A plugin may be composed of several mixins. The order is significant.
          "typeAdapter", // This is the first mixin in this plugin. Its' code will be operated on first. Calls to super will go to the next mixin.
          "appendValues" // This second mixin in this plugin will be operated on after typeAdapter. Calls to super here will go to the transform super.
        ],
        delimitValues: [
          "delimitValues"
        ],
        filterAttribute: [
          "typeAdapter",
          "filterAttributes"
        ],
        filterAttributeMulti: [
          "typeAdapter",
          "filterAttributes"
        ],
        objectKeysTransform: [
          "objectKeysTransform"
        ],
        prependValuesAdapter: [
          "typeAdapter",
          "prependValues"
        ],
        regexWordBoundariesValues: [
          "regexWordBoundariesValues"
        ],
        tokenTemplateValues: [
          "tokenTemplateValues"
        ],
        tokenTemplateValuesMulti: [
          "typeAdapter",
          "tokenTemplateValues"
        ]
      }
    }
  }
}
```

#### Step 3 Create a molotov.js file that implements the molotov class

Create a molotov.js file in your package. This will be a factory function that returns a class that extends the molotov class in the molotov module. This returned class will provide you with the mixin classes you've indicated in your molotov configuration. It also allows you to 1) provide the capability to override your plugin definitions via a options object and 2) provide the ability for packages to provide their own supers or override yours with custom classes and provide their own mixins or override your mixin and plugin definitions via the Cocktail class.

You need to pass in the following things into the instantiation of your molotov class:

* Molotov configuration object (created in step 2)
* An object containing your supers classes (created in step 1A)
* An object containing your mixins classes (created in step 1B)
* A namespace for your package.

You may also provide the ability to pass in 2 parameters:

* Configuration Overrides: A molotov configuration object which can be used to overwrite your existing plugin definitions.
* Cocktail Classes: An array of Cocktail Classes (described later in this readme) which can be used by packages using your package to provide or override supers and mixins.

Let's look at an example molotov.js class from the schemePunk module:

```js
// We have all of our config in this json file. Require it.
const molotovConfig = require('./molotov.json');

// require the directory with all of your supers classes.
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your supers classes.
//  supersDirectory
//  |-- exampleSuperNameSpace.js
const supers = require('./supers');

// require the directory with all of your mixins.
// The directory will be organized with directories representing
// super name spaces
// and those directories will hold your mixins
//  mixins
//  |-- exampleSupersNameSpace
//  |-- | -- mixinOne.js
//  |-- | -- mixinTwo.js
const mixins = require('./plugins');


// Require the molotov file from the molotov module.
// You will be extending this class.
const Molotov = require('molotov/lib/molotov');

// this is the package name space
const molotovNameSpace = 'schemePunk';

// By extending the molotov class you use the common molotov
// interface and provide your super and requires at require time.
// ensuring require caching.

// Also, by extending the molotov class you allow other module writers
// to use or extend your plugins with their cocktail classes.

const SchemePunkMolotov = class extends Molotov {
  constructor(overrides, cocktailClasses) {
    super(molotovConfig, molotovNameSpace, supers, mixins, overrides, cocktailClasses);
  }
};

// This then is the factory function we will export.
// Notice how schemePunk passes in a config object with overrides and cocktailClasses.

// This is optional - if you don't want to allow or use any of the override or cocktailClass capabilities
// simply include them in your factory function.

/**
 * SchemePunkMolotov Factory.
 * @param {Object} configObject
 *   Options for the schemePunkMolotov.
 * @param {Object} configObject.config
 *   Any dynamic molotov configuration to pass along.
 * @param {Array} configObject.cocktailClasses
 *   An array of cocktail classes that modules implementing schemePunk may
 *   use to override plugins and supers.
 */
module.exports = function schemePunkMolotov(configObject = {overrides: {}, cocktailClasses: []}) {
  return new SchemePunkMolotov(configObject.overrides, configObject.cocktailClasses);
};

```

#### Step 4: Use your molotov class within a super/mixin's implementer class

Now we can finally use our molotov mixin layers within our package. One pattern that we like is to create factory functions to return our mixin layers - in this way we can specify what plugin we want or even just the super mixin. We can also ensure that if we have any supers calls that we need to ensure call the entire way through the stack regardless of the mixin layer composition that they get fired from the class returned by the factory function.

Let's take a look at that factory approach mentioned above. Again let's turn our attention to how this is done in schemePunk:

```js

// We require our molotov.js file that we wrote in step 3.
const Molotov = require('../molotov');

// We are using the factory function method so we can indicate a specific mixinLayer by name.
// Also notice that we are passing in molotov config thereby allowing packages who use schemePunk to provide overrides and cocktailClasses.

// This factory is for the destination super.
module.exports = function destinationFactory(pluginName, molotovConfig = {overrides: {}, cocktailClasses: []}) {
  let setUp;
  // Here we call the molotov.js factory and pass along any config we have.
  const molotov = Molotov(molotovConfig);
  // If we were given a plugin name look for that plugin in our destination supers.
  if (pluginName) {
    setUp = molotov.getMolotov().resolve().destination[pluginName]; // Ensures we get any superOverrides from config.
  }
  else {
    setUp = molotov.mixSupers().getMolotov().getSupers().destination;
  }
  // A little bit of error messaging never hurt anybody.
  let msg;
  if (!setUp) {
    msg = `Destination was called with no plugins but the super did not exist in the supers Object.`;
    if (pluginName) {
      msg = `A destination plugin named: ${pluginName}, was called but did not exist in the destination Object.`;
    }
    return Promise.reject(new Error(msg));
  }

  // Now we will return a promise that returns our mixin layer. THe schemePunkDestination class is essentially
  // the true first operator and supers then go through the mixin chain. It can be useful as it is here to provide
  // initialization and ensure that calls to specific functions go through the entire mixinlayer.
  return Promise.resolve(setUp).then(extendedClass => class schemePunkDestination extends extendedClass {
    init(options, transformedValue, scheme, holdOvers, callPath) {
      return super.init(options, transformedValue, scheme, holdOvers, callPath);
    }
    /**
     * Here for mixins.
     */
    writeDestinationTarget() {
      return super.writeDestinationTarget();
    }
  });
};

```

*Note: If this pattern isn't useful to you then as long as you call resolve from Molotov's getMolotov() function and resolve that as a promise you do not need to implement a factory function like the one above to use molotov.*

--------------------

### Overrides and Cocktail: How to override a package that implements molotov mixins with Overrides and Cocktail Classes

--------------------

#### Using Overrides

For molotov implementers who allow you to override it is very easy to override plugin composition. You provide a molotovConfig with your overrides when calling schemePunk.
The only caveat with overrides is that you cannot add any mixins or supers. You may add a mixinlayer that is composed of existing mixins and you may override an existing named plugin.

Let's use schemePunk once again to demonstrate:

```js
// We'll create our override configuration.
// Let's say we want to use the prepend and append plugins with the type adapter
// in a transform mixinLayer.
// That isn't a plugin that exists but the mixins to create it certainly do.

const SchemePunk = require('@schemepunk/scheme-punk')

const ourOverrides = {
  molotovPlugins: { // Like the molotov configuration describe above we have a molotovPlugins key.
    transform: { // Just as above we put mixinlayers underneath their applicable super.
      prependAppend: [ // This is a new plugin name for our overrides provided mixin layer. It will consist of the following mixins in this order.
        "typeAdapter",
        "prependValues"
        "appendValues"
      ]
    }
  }
};

const options = {};// your shemepunk options.;

// Now we pass along our overrides to schemePunk according to their api.
//   constructor(options, molotovConfig = {overrides: {}, cocktailClasses: []}) {}

const schemePunk = new SchemePunk(options, { overrides: ourOverrides, cocktailClasses: [] });
// now schemePunk will be an instance of schemePunk with the prependAppend mixinlayer plugin.

```

You'll need to check with each molotov implementing package to see if they allow molotov overrides and how and where to pass them.

----

#### Using Cocktail Classes to provide your own supers and mixins to a molotov mixin implementing package or to override their supers and mixins.

Cocktail classes have much the same structure as a molotov implementing package's molotov.js and use their own molotovConfiguration to override or define new supers for a molotov implementing package and use molotovPlugins within their config to define or override a molotov implementing package's plugins.

The steps to implement your Cocktail class will thus be very similar:

1) Create your supers classes and mixins.
2) Create configuration for your package.
3) Create a cocktail.js file that implements the Cocktail class from molotov.
4) Pass your cocktail classes along

#### Step 1: Create your supers classes and mixins

Refer to the section in the molotov documentation on creating supers or mixins to help. You will need to observe the same process with the same endgoal of creating objects keyed by superNameSpaces and mixin names as above for passing into the cocktail class.

Be sure to follow the APIs for the molotov mixin implementing modules you are overriding if you are creating mixins or supers to use with existing mixins or supers.

#### Step 2: Create configuration for your package

Refer to the section in the molotov documentation on creating molotov config. Cocktail uses the same format. However, like config overrides you do not need to include the supersNameSpace key in the config unless you intend to override existing supers or define your own.

> **Tip**: You can override existing supers by using the molotov mixin provider's mixin supersNameSpace key but use a value of a supers key from your own supers object you pass into the cocktail class.

#### Step 3: Create a cocktail.js factory that returns an instance of a class which extends the Cocktail class from molotov

Just like the molotov.js above we need to require all of our supers and mixins in this class and have it return an instance of the cocktail class we create.

Let's look at an example Cocktail factory that we might put into a package that uses the SchemePunk module. We'll have our Cocktail factory provide a custom mixin and mixinlayer plugin for the transform supersNameSpace for use with schemePunk.

```js
// Require the cocktail class from molotov so we can extend it.
const Cocktail = require('molotov/lib/cocktail');

// This directory contains our mixin and an index file exporting it a key and value
// under the transform supersNameSpace key.
const cocktailMixins = require('./firstExampleMixins');

// This could be static or dynamic. Static has the advantage of a declarative visible (codewise) canonical version of a plugin.
// Dynamic offers runtime mixin composeability.
const cocktailConfig = {
  schemePunk: { // The name space your cocktail class is targeting. In this case, schemePunk.
    molotovPlugins: { // In this case our cocktail class is only adding custom plugins. This is the key for "molotov" plugins. A "Real" mixin composer:  https://github.com/thebruce/molotov
      transform: { // Export your plugins under the named key of the super's interface with whom they conform.
        arrayOrValueToSingleValue: [ // This key is your plugin name. You will use this name in your schemes when you want to use this plugin.
          'arrayOrValueToSingleValue', // Your plugin can be composed of one or more mixins. This matches the named export in your mixins object.
        ],
      },
    },
  },
};
/**
 * A cocktail implementing class. Modules that implement scheme-punk
 * but want to provide their own supers or plugins will need one of these.
 * This uses the molotov package's Cocktail class to provide a uniform interface
 * to our custom plugins and supers.
 *
 * @class CocktailHelper
 * @extends {Cocktail}
 */
class CocktailHelper extends Cocktail {
  /**
   * Creates an instance of CocktailHelper.
   * @memberof CocktailHelper
   */
  constructor() {
    // In this case we are only passing in our config and mixins, and
    // null for the supers since we are using schemePunks supers.
    super(cocktailConfig, null, cocktailMixins);
  }
}

// Finally export an instance of our class essentially making this a factory.
module.exports = new CocktailHelper();

```

#### Step 4: Pass your cocktail classes along to the molotov mixin implementing package according to their api.

You will need to consult the documentation of the moltov mixin implementing package to know where and when to pass the cocktailClass.

As an example a call to schemePunk has you pass it in a moltovConfig object:

```js
const schemePunk = new SchemePunk(options, { overrides: ourOverrides, cocktailClasses: [yourCocktailClass]);
```