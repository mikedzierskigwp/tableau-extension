import React, { useEffect } from 'react';
import './App.css';

const { tableau } = window;


function App() {
  useEffect(() => {
    tableau.extensions.initializeAsync();
  }, []);

  async function updateParameter(param_name, value) {
    tableau.extensions.dashboardContent.dashboard.getParametersAsync().then((parameters) => {
      parameters.forEach((param) => {
        if (param.name === param_name) {
          param.changeValueAsync(value);
        }
      });
    });
  }

  async function getValsForAPI() {
    tableau.extensions.dashboardContent.dashboard.worksheets.map(worksheet =>
      worksheet.getFiltersAsync().then(function (filters) {

        filters.forEach((filter) => {
          // /\s+/g - remove whitespace
          if (filter.worksheetName === 'API') {
            let filterName = 'ep' + filter.fieldName.replace(/\s+/g, '_').trim();
            let filterVals;

            // /,\s*$/ - remove trailing comma
            if (filter._filterType === 'categorical') {
              if (!filter.isAllSelected) {
                filterVals = filter.appliedValues.reduce((acc, val) => acc + val._formattedValue + ',', '');
              } else {
                filterVals = 'All';
              };
            } else if (filter._filterType === 'range') {
              filterVals = '{"date_start":"' + filter.minValue.formattedValue + '",' + '"date_end":"' + filter.maxValue.formattedValue + '"}'
            }

            filterVals = filterVals.replace(/,\s*$/, '')

            updateParameter(filterName, filterVals)

            console.log([filterName, filterVals])
          };
        });

      }
      ));
  }

  return (
    <div>
      <button onClick={getValsForAPI}>GO</button>
    </div>
  );

}

export default App;