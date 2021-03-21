
import { useRecoilState } from 'recoil';

import { colorIndexState } from '../state/atoms';

function useColor() {
  const [colorIndex, setColorIndex] = useRecoilState(colorIndexState);

  // stolen from https://formidable.com/open-source/victory/gallery/stacked-histogram
  const colorScale = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600"
  ];

  const getNextColor = () => {
    const out = colorScale[colorIndex];

    let newIndex = colorIndex + 1;
    if (newIndex >= colorScale.length) {
      newIndex = 0;
    }

    setColorIndex(newIndex);

    return out;
  }
  
  return { getNextColor };
}

export default useColor;