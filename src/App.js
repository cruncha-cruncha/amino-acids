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

  /*
  PLAN:
  - get rid of checkboxes on filter table
  - change wording: "selected" -> "chosen", "detail", or "compare", idk
  - add checkboxes to selected table to toggle visibility on the graph
  - can only remove chosen by clicking on them in the chosen table, clicking on them in the filter table only ever adds
  */


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
