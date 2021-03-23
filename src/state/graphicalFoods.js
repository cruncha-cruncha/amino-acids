import { selector } from 'recoil';

import { selectedFoodsState, aminoLookupState, normalizeGraphState, dailyRatioState } from './atoms';
import { dailyRatioOptionsState } from './dailyRatioOptions';

const witnessName = 'Histidine';

export const graphicalFoodsState = selector({
  key: 'graphicalFoods',
  get: ({get}) => {
    const normalizeGraph = get(normalizeGraphState);
    const selectedFoods = get(selectedFoodsState);
    const aminoLookup = get(aminoLookupState);
    const dailyRatioOptions = get(dailyRatioOptionsState);
    const dailyRatio = get(dailyRatioState);
    
    const absoluteData = selectedFoods
      .filter(food => food.visible)
      .map(food => ({
        color: food.color,
        data: Object.keys(aminoLookup).map(aid => ({
          aid: aid,
          amount: food[aid]
        }))
      })
    );

    if (normalizeGraph) {
      const witnessAmount = dailyRatioOptions[dailyRatio][witnessName];

      const reverseAminoLookup = Object.keys(aminoLookup).reduce((out, key) => ({
        ...out,
        [aminoLookup[key]]: key
      }), {});
    
      const recommendedDailyRatios = {};
      for (const [name, amount] of Object.entries(dailyRatioOptions[dailyRatio])) {
        recommendedDailyRatios[reverseAminoLookup[name]] = amount / witnessAmount;
      }

      return absoluteData.map(x => ({
        color: x.color,
        data: x.data.map(d => ({
          aid: d.aid,
          amount: d.amount / recommendedDailyRatios[d.aid]
        }))
      }));
    } else {
     return absoluteData; 
    }
  },
});