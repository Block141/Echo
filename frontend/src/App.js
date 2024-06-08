// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import InterestSelector from './components/InterestSelector';
import Dashboard from './components/Dashboard'; // Placeholder for your Dashboard component
import SignUp from './components/SignUp'; // Placeholder for your SignUp component
import Login from './components/Login'; // Placeholder for your Login component

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" component={InterestSelector} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
