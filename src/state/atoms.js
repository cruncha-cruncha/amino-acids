import { atom } from 'recoil';

export const foodsIndexState = atom({
  key: 'foodsIndex',
  default: {},
});

export const aminoLookupState = atom({
  key: 'aminoLookup',
  default: {},
});

export const selectedFoodIdsState = atom({
  key: 'selectedFoodIds',
  default: [],
});