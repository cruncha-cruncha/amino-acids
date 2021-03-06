import React, { useState, useEffect } from 'react';
import { Label, Input } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';

import useFoodSearch from '../../hooks/useFoodSearch';

function FoodSearch() {
  const { columnDefs, rowData, nameSearch, selected, addSelected } = useFoodSearch(); 

  const pageSize = 20;

  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const harmonizeSelected = () => {
    if (gridApi) {
      const selectedIds = selected.map(food => food.id);
      gridApi.forEachNode((n) => {
        n.setSelected(selectedIds.includes(n.data.id))
      });
    }
  }

  const handleModelUpdated = () => {
    harmonizeSelected();
  }

  useEffect(() => {
    harmonizeSelected();
  }, [selected])

  const handleRowClicked = (e) => {
    addSelected(e.node.data.id);
  }

  return (
    <div className="my-5">
      <div className="d-flex flex-row align-items-center mb-4">
        <Label for="foodSearchFilterPhrase" className="mb-0 mr-4">Filter</Label>
        <Input type="text" id="foodSearchFilterPhrase" onChange={(e) => nameSearch(e.target.value)} />
      </div>
      <div className="ag-theme-alpine">
        <AgGridReact
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true
          }}
          rowSelection={'multiple'}
          headerHeight={0}
          rowData={rowData}
          onGridReady={onGridReady}
          domLayout={'autoHeight'}
          onRowClicked={handleRowClicked}
          columnDefs={columnDefs}
          suppressCellSelection={true}
          pagination={true}
          paginationPageSize={pageSize}
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

export default FoodSearch;