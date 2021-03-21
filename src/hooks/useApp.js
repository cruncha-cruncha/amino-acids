import { useSetRecoilState } from 'recoil';

import { foodsIndexState, aminoLookupState } from '../state/atoms';
import { data } from "../data";

function useApp() {
  const setFoodsIndex = useSetRecoilState(foodsIndexState);
  const setAminoLookup = useSetRecoilState(aminoLookupState);

  setFoodsIndex(data.foods);
  setAminoLookup(data.aminos);
}

export default useApp;