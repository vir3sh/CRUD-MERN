import React, { useState } from 'react';
import { registerPatient } from '../../api';
import '../../styles.css'

const PatientRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '', condition: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerPatient(formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register as Patient</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
      <input type="text" name="condition" placeholder="Condition" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default PatientRegister;
