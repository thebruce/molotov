// @flow

import type Cocktail from '../cocktail';

export type pluginsList = {
  [superNameSpace: string]: {
    [mixinArrayName: string]: string[]
  }
}

export type molotovConfig = {
  [namespace: string]: {
    supersNameSpace: string[],
    molotovPlugins: pluginsList
  }
}

export type overrideConfig = {
  [namespace: string]: {
    supersNameSpace?: string[],
    molotovPlugins?: pluginsList
  }
};

export type supers = {
  [namespace: string]: Class<*>
}

export type mixins = {
  [namespace: string]: {
    [mixinName: string]: Class<*>
  }
}

export type plugins = {
  [namespace: string]: {
    [pluginName: string]: Class<*>
  }
}

export type target = ("molotovPlugins" | "supersNameSpace");

export type CocktailArray = Array<?Cocktail>;

export interface ProviderBase<T> {
  target: target;
  type: string;
  setType(string): void;
  getType(): string;
  setTarget(target): void;
  getTarget(): target;
  mergeConfig(): molotovConfig;
  validateMolotovConfig(string): boolean;
}

export interface ProviderImplementation<T> {
  mixCocktails(): T;
  resolve(): T;
}
