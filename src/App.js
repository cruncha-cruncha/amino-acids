import React, { useState, useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';

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

  // sudden reveal is janky, how about a nice css slide-reveal effect
  // https://reactstrap.github.io/components/collapse/

  // and can data on the graph smoothly transition?

  return (
    <div className="container py-5 min-vh-100 d-flex flex-column justify-content-between">
      <div className="main-content">
        {visibilityLatch &&
          <React.Fragment>
            <AminoGraph />
            <SelectedFoods />
          </React.Fragment>
        }
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
