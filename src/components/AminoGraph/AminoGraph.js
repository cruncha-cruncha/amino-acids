import React from 'react';
import { VictoryAxis, VictoryChart, VictoryBar, VictoryLabel, VictoryVoronoiContainer, VictoryTheme, VictoryStack } from 'victory';

import useAminoGraph from '../../hooks/useAminoGraph';

// show recommended amino acid ratios, see https://en.wikipedia.org/wiki/Essential_amino_acid
// - have them stick to the limiting amino
// graph options:
// - binary toggle: "absolute" and "relative"; abslute shows amino acid amounts, relative scales amounts by recommeneded amino ratios
// - select: amino ratios (WHO, USDA, whatevere other source I can find)

// https://formidable.com/open-source/victory/docs/
// https://formidable.com/open-source/victory/gallery/stacked-histogram
function AminoGraph() {
  const { aminoLookup, data } = useAminoGraph();

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
    <VictoryChart
      domainPadding={20}
      height={300}
      theme={VictoryTheme.material}
    >
      <VictoryAxis
        style={xAxisStyles}
        tickValues={Object.keys(aminoLookup)}
        tickFormat={Object.values(aminoLookup).map(a => a.slice(0, 3))}
      />
      <VictoryAxis
        dependentAxis
        style={yAxisStyles}
        label="grams"
      />
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
  );
}

export default AminoGraph;