import React from 'react';
import { AgGridReact } from 'ag-grid-react';

import useSelectedFoods from "../../hooks/useSelectedFoods";

function SelectedFoods() {
  const { columnDefs, rowData, totalsRow, removeSelected } = useSelectedFoods();

  const pageSize = 20;

  const handleRowClicked = (e) => {
    removeSelected(e.node.data.id);
  }

  console.log("totalsRow", totalsRow);

  return (
    <div className="my-5">
      <div className="mb-1">
        <span>Grams of essential amino acids per 100g of food. "Met" is methionine + cystine, "Phe" is phenylalanine + tyrosine, all others are single acids.</span>
      </div>
      <div className="ag-theme-alpine row-hover-delete" style={{ height: 400 }}>
        <AgGridReact
          defaultColDef={{
            resizable: true
          }}
          rowData={rowData}
          onRowClicked={handleRowClicked}
          columnDefs={columnDefs}
          suppressCellSelection={true}
          pagination={true}
          paginationPageSize={pageSize}
          pinnedBottomRowData={[totalsRow]}
          suppressNoRowsOverlay={true}
        >
        </AgGridReact>
      </div>
    </div>
  )
}

export default SelectedFoods;