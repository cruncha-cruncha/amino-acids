import { useRecoilValue } from 'recoil';

import { aminoLookupState } from '../state/atoms';
import graphicalFoodsState from '../state/graphicalFoods';

function useAminoGraph() {
  const aminoLookup = useRecoilValue(aminoLookupState);
  const data = useRecoilValue(graphicalFoodsState);

  return {
    aminoLookup,
    data
  };
}

export default useAminoGraph;