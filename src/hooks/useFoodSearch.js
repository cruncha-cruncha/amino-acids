
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { foodsIndexState, selectedFoodIdsState } from '../state/atoms';

function useFoodSearch() {
  const foodsIndex = useRecoilValue(foodsIndexState);
  const [selectedFoodIds, setSelectedFoodIds] = useRecoilState(selectedFoodIdsState);

  const [allFoods, setAllFoods] = useState([])
  const [searchResults, setSearchResults] = useState([]);

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

  const setSelected = (selected) => {
    setSelectedFoodIds(selected.map(x => x.id));
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
    selected: selectedFoodIds,
    setSelected
  }
}

export default useFoodSearch;