import React, { useEffect } from "react";
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
          if (filter.worksheetName === 'VIMP - istotność') {
            let filterName = "ep" + filter.fieldName.replace(/\s+/g, '_').trim();
            let filterVals;

            // /,\s*$/ - remove trailing comma
            if (filter._filterType === "categorical") {
              if (!filter.isAllSelected) {
                filterVals = filter.appliedValues.reduce((acc, val) => acc + val._formattedValue + ',', '');
                updateParameter(filterName, filterVals.replace(/,\s*$/, ""))
              } else {
                filterVals = 'All';
                updateParameter(filterName, filterVals.replace(/,\s*$/, ""))

              };
            } else if (filter._filterType === "range") {
              filterVals = "min:" + filter.minValue.formattedValue + "," + "max:" + filter.maxValue.formattedValue
              updateParameter(filterName, filterVals.replace(/,\s*$/, ""))
            }
          };
        });

      }
      ));
  }

  async function handleClick() {
    updateParameter('isNewRequest', Math.random())
    getValsForAPI()
  }

  return (
    <div>
      <button onClick={handleClick}>GO</button>
    </div>
  );

}

export default App;