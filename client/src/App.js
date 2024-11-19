import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientRegister from './components/patients/Register';
import PatientLogin from './components/patients/Login';
import DoctorRegister from './components/doctors/Register';
import DoctorLogin from './components/doctors/Login';
import Home from './components/Home';
import DoctorList from './components/DoctorList';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patient/register" element={<PatientRegister />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctors" element={<DoctorList />} /> {/* New route */}
    </Routes>
  </Router>
);

export default App;
