import { useRecoilValue } from 'recoil';

import { aminoLookupState } from '../state/atoms';
import { graphicalFoodsState } from '../state/graphicalFoods';
import { aminoAmountTotalsState } from '../state/aminoAmountTotals';

function useAminoGraph() {
  const aminoLookup = useRecoilValue(aminoLookupState);
  const data = useRecoilValue(graphicalFoodsState);
  const aminoAmountTotals = useRecoilValue(aminoAmountTotalsState);

  const maxAminoAmountTotal = Object.values(aminoAmountTotals).reduce((max, amount) => {
    if (amount < max) {
      return max;
    } else {
      return amount;
    }
  }, NaN);

  const lineWidth = maxAminoAmountTotal * 0.01;

  const witnessName = 'Histidine';

  const recommendedDailyHumanReadable = {
    'Histidine': 14,
    'Isoleucine': 19,
    'Leucine': 42,
    'Lysine': 38,
    'Methionine': 19,
    'Phenylalanine': 33,
    'Threonine': 20,
    'Tryptophan': 5,
    'Valine': 24
  };

  const witnessAmount = recommendedDailyHumanReadable[witnessName];

  const reverseAminoLookup = Object.keys(aminoLookup).reduce((out, key) => ({
    ...out,
    [aminoLookup[key]]: key
  }), {});

  const recommendedDailyRatios = {};
  for (const [name, amount] of Object.entries(recommendedDailyHumanReadable)) {
    recommendedDailyRatios[reverseAminoLookup[name]] = amount / witnessAmount;
  }

  const normalizedTotals = {};
  for (const [aid, total] of Object.entries(aminoAmountTotals)) {
    normalizedTotals[aid] = total / recommendedDailyRatios[aid];
  }

  const limitingAminoId = Object.keys(normalizedTotals).reduce((minData, aid) => {
    const val = normalizedTotals[aid];
    if (val > minData.val) {
      return minData;
    } else {
      return { aid, val };
    }
  }, { aid: '', val: NaN }).aid;

  const recommendedData = Object.keys(recommendedDailyRatios).map(aid => {
    const y = aminoAmountTotals[limitingAminoId] / recommendedDailyRatios[limitingAminoId] * recommendedDailyRatios[aid]; 
    return {
      aid: aid,
      y: y,
      y0: y - lineWidth
    }
  });

  console.log(maxAminoAmountTotal, lineWidth);

  const normalizedData = data.map(x => ({
    color: x.color,
    data: x.data.map(d => ({
      aid: d.aid,
      amount: d.amount / recommendedDailyRatios[d.aid]
    }))
  }));
  
  return {
    aminoLookup,
    data,
    recommendedData
  };
}

export default useAminoGraph;