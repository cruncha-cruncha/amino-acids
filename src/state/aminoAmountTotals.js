import { selector } from 'recoil';

import { selectedFoodsState, aminoLookupState } from './atoms';

export const aminoAmountTotalsState = selector({
  key: 'aminoAmountTotals',
  get: ({get}) => {
    const selectedFoods = get(selectedFoodsState);
    const aminoLookup = get(aminoLookupState);

    const aminoIdList = Object.keys(aminoLookup);
    return selectedFoods.reduce((out, food) => {
      for (const aid of aminoIdList) {
        out[aid] += food[aid];
      }
      return out;
    }, aminoIdList.reduce((out, id) => {
      out[id] = 0; return out;
    }, {}));
  },
});