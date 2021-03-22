import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import useSelectedFoods from "../../hooks/useSelectedFoods";

function SelectedFoods() {
  const { columnDefs, rowData, totalsRow, removeSelected } = useSelectedFoods();
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

  const handleCellClicked = (e) => {
    if (e.colDef.field === "name") {
      removeSelected(e.data.id);
    }
  }

  return (
    <div className="my-5">
      <div className="mb-1">
        <span>Grams of essential amino acids per an amount of food (default is 100g, click on the value to edit it). Click on a food name to de-select it. "Met" is methionine + cystine, "Phe" is phenylalanine + tyrosine, all others are single acids.</span>
      </div>
      <div className="ag-theme-alpine less-x-pad no-hover" style={{ height: 400 }}>
        <AgGridReact
          defaultColDef={{
            resizable: true
          }}
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
        >
        </AgGridReact>
      </div>
    </div>
  )
}

export default SelectedFoods;