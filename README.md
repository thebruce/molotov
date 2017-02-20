# Molotov: (Mix/Plug)-in loader for explosive composeability

Molotov is a plug in loader and/or interface for use with modules providing mixin styled plugins and modules that are implementing overrides on mixin style provider modules.

## To Provide molotov style plugin capabilities:
Modules providing molotov style plugin capabilities should implement molotov by:
1) Extend or implement superMixologist to provide molotov with nameSpaced supers.
2) Extend or implement molotov.js with a custom Molotov implementation OR call molotov.js and pass the appropriate parameters.
3) Add a molotov.json file (see Example) to the root of your project and fill in the relevant details.

### Example: A .molotov.json file
An example of the .molotov.json file for the scheme-punk project.
```
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

## To have your modules override molotov provider modules through config and the molotov/cocktail class.

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