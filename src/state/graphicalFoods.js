import { selector } from 'recoil';

import { selectedFoodsState, aminoLookupState } from './atoms';

export const graphicalFoodsState = selector({
  key: 'graphicalFoods',
  get: ({get}) => {
    const selectedFoods = get(selectedFoodsState);
    const aminoLookup = get(aminoLookupState);

    return selectedFoods.map(food => ({
      color: food.color,
      data: Object.keys(aminoLookup).map(aid => ({
        aid: aid,
        amount: food[aid]
      }))
    }));
  },
});