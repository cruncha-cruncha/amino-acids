
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { foodsIndexState, aminoLookupState, selectedFoodIdsState } from '../state/atoms';

function useFoodSearch() {
  const foodsIndex = useRecoilValue(foodsIndexState);
  const aminoLookup = useRecoilValue(aminoLookupState);
  const [selectedFoodIds, setSelectedFoodIds] = useRecoilState(selectedFoodIdsState);

  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      hide: true
    },
    {
      headerName: "Food",
      field: "name",
      flex: 1
    }
  ];

  columnDefs.push( ...Object.keys(aminoLookup).map(k => ({ headerName: aminoLookup[k].slice(0, 3), field: k, width: 80 })) );

  const removeSelected = (idToRemove) => {
    setSelectedFoodIds(selectedFoodIds.filter(id => id != idToRemove));
  }

  const rowData = selectedFoodIds.map(id => {
    const info = foodsIndex[id];
    const out = { id: info.id, name: info.name };
    return { ...out, ...info.aminoAmounts };
  });

  const aminoAmountTotals = selectedFoodIds.reduce((out, id) => {
    const info = foodsIndex[id];
    for (const k in info.aminoAmounts) {
      out[k] = out[k] ? out[k] + info.aminoAmounts[k] : info.aminoAmounts[k];
    }
    return out;
  }, Object.keys(aminoLookup).reduce((out, id) => {
    out[id] = 0; return out;
  }, {}));


  const totalsRow = {
    id: 0,
    name: 'total',
    ...aminoAmountTotals
  }

  return {
    columnDefs,
    rowData,
    totalsRow,
    removeSelected
  }
}

export default useFoodSearch;