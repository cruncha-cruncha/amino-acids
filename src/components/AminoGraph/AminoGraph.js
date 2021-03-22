import React from 'react';
import { VictoryAxis, VictoryChart, VictoryBar, VictoryTheme, VictoryStack } from 'victory';
import Switch from 'react-switch';
import { Input } from 'reactstrap';

import useAminoGraph from '../../hooks/useAminoGraph';

// show recommended amino acid ratios, see https://en.wikipedia.org/wiki/Essential_amino_acid
// - have them stick to the limiting amino
// graph options:
// - binary toggle: "absolute" and "relative"; abslute shows amino acid amounts, relative scales amounts by recommeneded amino ratios
// - select: amino ratios (WHO, USDA, whatevere other source I can find)

// https://formidable.com/open-source/victory/docs/
// https://formidable.com/open-source/victory/gallery/stacked-histogram
function AminoGraph() {
  const {
    aminoLookup,
    data,
    graphIsNormalized,
    toggleNormalizeGraph,
    dailyRatio,
    setDailyRatio,
    dailyRatioOptions,
  } = useAminoGraph();

  const xAxisStyles = {
    tickLabels: {
      fontSize: 12
    }
  }

  const yAxisStyles = {
    tickLabels: {
      fontSize: 8
    },
    axisLabel: {
      padding: 36,
      fontSize: 12
    }
  };

  return (
    <div>
      <div className="d-flex flex-row justify-content-end align-items-center mx-5" style={{ minHeight: 40 }}>
        {graphIsNormalized && 
          <div className="d-flex flex-row align-items-center mr-4">
            <span className="d-block mr-2" style={{ flexShrink: 0 }}>Recommended daily ratios according to:</span>
            <Input type="select" onChange={(e) => setDailyRatio(e.target.value)}>
              {dailyRatioOptions.map(name => (
                <option value={name} selected={name === dailyRatio ? 'selected' : ''}>
                  {name}
                </option>
              ))}
            </Input>
          </div>}
        <div className="mr-3">
          <span style={graphIsNormalized ? { color: 'black' } : { color: 'grey' }}>normalize</span>
        </div>
        <Switch
          checked={graphIsNormalized}
          onChange={toggleNormalizeGraph}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
          id="material-switch"
        />
      </div>

      <VictoryChart
        domainPadding={20}
        padding={{ top: 20, right: 20, bottom: 30, left: 50 }}
        height={200}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          style={xAxisStyles}
          tickValues={Object.keys(aminoLookup)}
          tickFormat={Object.values(aminoLookup).map(a => a.slice(0, 3))}
        />
        {!graphIsNormalized &&
          <VictoryAxis
            dependentAxis
            style={yAxisStyles}
            label="grams"
          />}
        <VictoryStack>
          {data.map(food => (
            <VictoryBar
              style={{ data: { fill: food.color } }}
              data={food.data}
              x="aid"
              y="amount"
            />
          ))}
        </VictoryStack>
      </VictoryChart>
    </div>
  );
}

export default AminoGraph;