import logo from './wp_logo.png';
import './App.css';
import React, { useState, useEffect } from 'react'
/*global tableau*/

function App() {

  const [dashboardName, setDashboardName] = useState('')
  // eslint-disable-next-line
  const [sheetNames, setSheetNames] = useState([]);

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      const sheetNames = tableau.extensions.dashboardContent.dashboard.worksheets.map(worksheet => worksheet.name);

      setSheetNames(sheetNames);
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
      setDashboardName(dashboardName);

    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">
          {dashboardName}
          <br></br>
          <img src={logo} alt="logo" />
        </div>
      </header>
    </div>
  );
}

export default App;
