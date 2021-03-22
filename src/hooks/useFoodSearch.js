
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';

import useColor from './useColor';
import { foodsIndexState, selectedFoodsState } from '../state/atoms';

function useFoodSearch() {
  const foodsIndex = useRecoilValue(foodsIndexState);
  const [selectedFoods, setSelectedFoods] = useRecoilState(selectedFoodsState);

  const [allFoods, setAllFoods] = useState([])
  const [searchResults, setSearchResults] = useState([]);

  const { getNextColor } = useColor();

  useEffect(() => {
    setAllFoods(Object.values(foodsIndex).reduce((out, elem) => 
      [ ...out, { name: elem.name.toLowerCase(), id: elem.id}], []));
  }, [foodsIndex])

  useEffect(() => {
    setSearchResults(allFoods);
  }, [allFoods])

  const nameSearch = (phrase) => {
    phrase = phrase.trim()

    if (!phrase) {
      setSearchResults(allFoods)
      return
    }

    const terms = phrase.toLowerCase().split(" ");
    const results = []
    for (const elem of allFoods) {
      if (terms.reduce((out, term) => out & elem.name.includes(term), true)) {
        results.push({ ...elem });
      }
    }

    setSearchResults(results);
  }

  const updateSelected = (fid, add) => {
    if (add) {
      if (selectedFoods.filter(food => food.id === fid).length > 0) {
        return;
      }
      const info = foodsIndex[fid];
      setSelectedFoods([ ...selectedFoods, {
        id: info.id,
        name: info.name,
        foodAmount: 100,
        color: getNextColor(),
        ...info.aminoAmounts
      }]);
    } else {
      setSelectedFoods(selectedFoods.filter(food => food.id !== fid));
    }
  }

  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      hide: true
    },
    {
      headerName: "Foods",
      field: "name"
    }
  ];

  return {
    nameSearch,
    columnDefs,
    rowData: searchResults,
    selected: selectedFoods,
    updateSelected
  }
}

export default useFoodSearch;