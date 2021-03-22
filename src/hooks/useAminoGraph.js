import { useRecoilState, useRecoilValue } from 'recoil';

import { aminoLookupState, normalizeGraphState, dailyRatioState } from '../state/atoms';
import { graphicalFoodsState } from '../state/graphicalFoods';
import { dailyRatioOptionsState } from '../state/dailyRatioOptions';

function useAminoGraph() {
  const [normalizeGraph, setNormalizeGraph] = useRecoilState(normalizeGraphState);
  const aminoLookup = useRecoilValue(aminoLookupState);
  const data = useRecoilValue(graphicalFoodsState);
  const dailyRatioOptions = useRecoilValue(dailyRatioOptionsState);
  const [dailyRatio, setDailyRatio] = useRecoilState(dailyRatioState);

  const toggleNormalizeGraph = () => {
    setNormalizeGraph(!normalizeGraph);
  }
  
  return {
    aminoLookup,
    data,
    graphIsNormalized: normalizeGraph,
    toggleNormalizeGraph,
    dailyRatio,
    setDailyRatio,
    dailyRatioOptions: Object.keys(dailyRatioOptions),
  };
}

export default useAminoGraph;