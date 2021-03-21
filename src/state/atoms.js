import { atom } from 'recoil';

export const foodsIndexState = atom({
  key: 'foodsIndex',
  default: {},
});

export const aminoLookupState = atom({
  key: 'aminoLookup',
  default: {},
});

export const selectedFoodsState = atom({
  key: 'selectedFoods',
  default: [],
});

export const colorIndexState = atom({
  key: 'colorIndex',
  default: 0
});