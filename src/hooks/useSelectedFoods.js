
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { foodsIndexState, aminoLookupState, selectedFoodsState } from '../state/atoms';
import { aminoAmountTotalsState } from '../state/aminoAmountTotals';

function useFoodSearch() {
  const foodsIndex = useRecoilValue(foodsIndexState);
  const aminoLookup = useRecoilValue(aminoLookupState);
  const [selectedFoods, setSelectedFoods] = useRecoilState(selectedFoodsState);
  const aminoAmountTotals = useRecoilValue(aminoAmountTotalsState);
  const [totalsRow, setTotalsRow] = useState({});
  
  const handleFoodAmountChanged = (e) => {
    const newAmount = Number.parseFloat(e.newValue);
    if (newAmount.toString() !== e.newValue.trim()) {
      return;
    }

    const fid = e.data.id;
    const info = foodsIndex[fid];

    const newAA = { ...info.aminoAmounts } // new Amino Amounts
    for (const k in newAA) {
      newAA[k] = Math.round(newAmount * newAA[k] * 10) / 1000;
    }

    const updatedFood = {
      id: info.id,
      name: info.name,
      foodAmount: newAmount,
      color: e.data.color,
      ...newAA
    }
    
    const index = selectedFoods.findIndex(food => food.id === updatedFood.id);
    const out = [ ...selectedFoods ];
    out[index] = updatedFood;

    setSelectedFoods(out)
    updateTotalsRow();
  }

  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      hide: true
    },
    {
      headerName: '',
      field: "color",
      width: 10,
      maxWidth: 10,
      cellClass: "no-x-pad",
      cellStyle: params => ({ fontSize: 0, backgroundColor: params.value }),
      resizable: false
    },
    {
      headerName: "Food",
      field: "name",
      flex: 1,
      cellClass: "hover-cell-delete"
    },
    {
      headerName: 'g',
      field: "foodAmount",
      width: 80,
      editable: true,
      valueSetter: handleFoodAmountChanged
    },
    ...Object.keys(aminoLookup).map(k => ({ headerName: aminoLookup[k].slice(0, 3), field: k, width: 80 }))
  ];

  const updateTotalsRow = () => {
    setTotalsRow({
      id: 0,
      name: 'total',
      foodAmount: '',
      color: "#FFF",
      ...aminoAmountTotals
    });
  }

  useEffect(() => {
    updateTotalsRow();
  }, [selectedFoods]);

  const removeSelected = (idToRemove) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== idToRemove));
  }

  return {
    columnDefs,
    rowData: selectedFoods,
    totalsRow,
    removeSelected
  }
}

export default useFoodSearch;