
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { foodsIndexState, selectedFoodsState } from '../state/atoms';

function useFoodSearch() {
  const foodsIndex = useRecoilValue(foodsIndexState);
  const [selectedFoods, setSelectedFoods] = useRecoilState(selectedFoodsState);

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

  const updateSelected = (id) => {
    const add = (selectedFoods.filter(food => food.id == id).length == 0);
    if (add) {
      const info = foodsIndex[id];
      setSelectedFoods([ ...selectedFoods, {
        id: info.id,
        name: info.name,
        foodAmount: 100,
        ...info.aminoAmounts
      }]);
    } else {
      setSelectedFoods(selectedFoods.filter(food => food.id != id));
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