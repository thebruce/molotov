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
  molotovConfig: molotovConfig;
  molotovNameSpace: string;
  target: target;
  cocktails: CocktailArray;
  overrides: overrideConfig;
  type: string;
  setCocktails(CocktailArray): void;
  getCocktails(): CocktailArray;
  setMolotovConfig(molotovConfig): void;
  getMolotovConfig(): molotovConfig;
  setNameSpace(string): void;
  getNameSpace():string;
  setOverrides(overrideConfig): void;
  getOverrides():overrideConfig;
  setSupers(supers): void;
  getSupers(): supers;
  setType(string): void;
  getType(): string;
  setTarget(target): void;
  getTarget(): target;
  resolve(): T;
  mergeConfig(): molotovConfig;
  validateMolotovConfig(string): boolean;
  mixCocktails(): T;
}
