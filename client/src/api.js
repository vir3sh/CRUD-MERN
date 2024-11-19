import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const registerPatient = (data) => API.post('/patient/register', data);
export const loginPatient = (data) => API.post('/patient/login', data);

export const registerDoctor = (data) => API.post('/doctor/register', data);
export const loginDoctor = (data) => API.post('/doctor/login', data);
