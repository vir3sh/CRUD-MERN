import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import custom styles if needed

const Home = () => (
  <div className="home-container">
    <h1>Welcome to the Portal</h1>
    <p>Select an option to get started:</p>
    <div className="home-links">
      <div>
        <h2>Patient</h2>
        <Link to="/patient/register" className="home-link">Register as Patient</Link>
        <Link to="/patient/login" className="home-link">Login as Patient</Link>
      </div>
      <div>
        <h2>Doctor</h2>
        <Link to="/doctor/register" className="home-link">Register as Doctor</Link>
        <Link to="/doctor/login" className="home-link">Login as Doctor</Link>
      </div>
    </div>
  </div>
);

export default Home;
