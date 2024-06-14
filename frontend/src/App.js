import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InterestSelector from './components/InterestSelector';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Confirmation from './components/Confirmation';
import Welcome from './components/Welcome';
import { getCsrfTokenFromServer } from './csrf';

function App() {
  useEffect(() => {
    getCsrfTokenFromServer();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/interests" element={<InterestSelector />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
