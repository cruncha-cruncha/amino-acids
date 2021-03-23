import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import useSelectedFoods from "../../hooks/useSelectedFoods";

function SelectedFoods() {
  const { columnDefs, rowData, totalsRow, removeSelected, setVisibility } = useSelectedFoods();
  const [gridApi, setGridApi] = useState(null);
  const pageSize = 20;

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.setColumnDefs(columnDefs);
    }
  }, [rowData])

  const harmonizeSelected = () => {
    if (gridApi) {
      const visibleIds = rowData.filter(food => food.visible).map(food => food.id);
      gridApi.forEachNode((n) => {
        n.setSelected(visibleIds.includes(n.data.id))
      });
    }
  }

  const handleModelUpdated = () => {
    harmonizeSelected();
  }

  const handleCellClicked = (e) => {
    if (e.colDef.field === "name") {
      removeSelected(e.data.id);
    }
  }

  const handleRowSelected = (e) => {
    setVisibility({ rowData: e.data, isSelected: e.node.isSelected() });
  }

  return (
    <div className="my-5">
      <div className="mb-1">
        <span>Grams of essential amino acids per an amount of food (default is 100g, click on the value to edit it). Click on a food name to de-select it. "Met" is methionine + cystine, "Phe" is phenylalanine + tyrosine, all others are single acids.</span>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          defaultColDef={{
            resizable: true,
            checkboxSelection: isFirstColumn
          }}
          rowSelection={'multiple'}
          suppressRowClickSelection={true}
          onRowSelected={handleRowSelected}
          rowData={rowData}
          onCellClicked={handleCellClicked}
          columnDefs={columnDefs}
          suppressCellSelection={true}
          pagination={true}
          paginationPageSize={pageSize}
          pinnedBottomRowData={[totalsRow]}
          suppressNoRowsOverlay={true}
          singleClickEdit={true}
          onGridReady={onGridReady}
          onModelUpdated={handleModelUpdated}
        >
        </AgGridReact>
      </div>
    </div>
  )
}

function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  return displayedColumns[0] === params.column;
}

export default SelectedFoods;