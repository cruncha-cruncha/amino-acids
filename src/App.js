import React, { useState, useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { Collapse } from 'reactstrap';

import useApp from "./hooks/useApp";
import AminoGraph from "./components/AminoGraph";
import FoodSearch from "./components/FoodSearch";
import SelectedFoods from "./components/SelectedFoods";
import { selectedFoodsState } from './state/atoms';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './css/App.css';

function App() {
  useApp();
  const selected = useRecoilValue(selectedFoodsState)
  const [ visibilityLatch, setVisibilityLatch ] = useState(false);

  useEffect(() => {
    if (!visibilityLatch && selected.length > 0) {
      setVisibilityLatch(true);
    }
  }, [selected])

  return (
    <div className="container py-5 min-vh-100 d-flex flex-column justify-content-between">
      <div className="main-content">
        <Collapse isOpen={visibilityLatch} >
          <AminoGraph />
          <SelectedFoods />
        </Collapse>
        <FoodSearch />
      </div>
      <div className="footer d-flex flex-row justify-content-center">
        <a href="https://github.com/cruncha-cruncha/amino-acids">About</a>
      </div>
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
