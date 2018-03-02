// @flow

import type Cocktail from '../cocktail';

export type pluginsList = {
  [superNameSpace: string]: {
    [mixinArrayName: string]: string[]
  }
}

export type supersNameSpace = {
  [superName: string]: string,
}

export type molotovConfig = {
  [namespace: string]: {
    supersNameSpace: supersNameSpace,
    molotovPlugins: pluginsList
  }
}

export type overrideConfig = {
  [namespace: string]: {
    supersNameSpace?: supersNameSpace,
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

export type targetMp = "molotovPlugins";

export type targetSns = "supersNameSpace";

export type CocktailArray = Array<?Cocktail>;

export interface ProviderBase<Y: string> {
  type: string;
  target: Y;
  setType(string): void;
  getType(): string;
  setTarget(Y): void;
  getTarget(): Y;
  mergeConfig(molotovConfig, overrideConfig): molotovConfig;
  fetchOverrides(): molotovConfig;
  validateMolotovConfig(string): boolean;
}

export interface ProviderImplementation<T> {
  resolve(): T;
}
