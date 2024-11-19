import React, { useEffect, useState } from 'react';
import './DoctorsList.css'; // Optional CSS for styling

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctor/');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="doctors-container">
      {doctors.map((doctor) => (
        <div className="doctor-card" key={doctor._id}>
          {doctor.profilePicture && (
            <img src={`http://localhost:5000${doctor.profilePicture}`} alt={doctor.name} className="doctor-img" />
            )}

          <h3>{doctor.name}</h3>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
