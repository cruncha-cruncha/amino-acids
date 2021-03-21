import { selector } from 'recoil';

import { selectedFoodsState, aminoLookupState } from './atoms';

const graphicalFoodsState = selector({
  key: 'filteredTodoListState',
  get: ({get}) => {
    const selectedFoods = get(selectedFoodsState);
    const aminoLookup = get(aminoLookupState);

    return selectedFoods.map(food => ({
      fid: food.id,
      color: food.color,
      data: Object.keys(aminoLookup).map(aid => ({
        aid: aid,
        amount: food[aid]
      }))
    }));
  },
});

export default graphicalFoodsState;