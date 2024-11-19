import React, { useState } from 'react';
import { registerDoctor } from '../../api';  // Ensure this API handles file upload
import '../../styles.css';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', specialization: '' });
  const [file, setFile] = useState(null);  // State to handle file input

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      setFile(e.target.files[0]);  // Handle file input
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithFile = new FormData();
    formDataWithFile.append('name', formData.name);
    formDataWithFile.append('email', formData.email);
    formDataWithFile.append('password', formData.password);
    formDataWithFile.append('specialization', formData.specialization);

    // Append the file if it exists
    if (file) {
      formDataWithFile.append('profilePicture', file);
    }

    try {
      const response = await registerDoctor(formDataWithFile); // Send FormData to API
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Register as Doctor</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="specialization"
        placeholder="Specialization"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="profilePicture"
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default DoctorRegister;
