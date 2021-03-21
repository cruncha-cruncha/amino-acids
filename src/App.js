import React, { useState, useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';

import useApp from "./hooks/useApp";
import AminoGraph from "./components/AminoGraph";
import FoodSearch from "./components/FoodSearch";
import SelectedFoods from "./components/SelectedFoods";
import { selectedFoodIdsState } from './state/atoms';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './css/App.css';

function App() {
  useApp();
  const selected = useRecoilValue(selectedFoodIdsState)
  const [ visibilityLatch, setVisibilityLatch ] = useState(false);

  useEffect(() => {
    if (!visibilityLatch && selected.length > 0) {
      setVisibilityLatch(true);
    }
  }, [selected])


  return (
    <div className="container my-5">
      {visibilityLatch &&
        <React.Fragment>
          <AminoGraph />
          <SelectedFoods />
        </React.Fragment>
      }
      <FoodSearch />
    </div>
  );
}

function AppContainer() {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  )
}

export default AppContainer;
