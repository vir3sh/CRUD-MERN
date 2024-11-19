const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Rename the file with a unique name (timestamp + original extension)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }); // Initialize multer with the storage configuration

// POST /register - Doctor Registration with Profile Picture
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

    // Handle profile picture
    let profilePicture = '';
    if (req.file) {
      profilePicture = '/uploads/' + req.file.filename; // Store the file path of the uploaded image
    }

    // Create a new doctor
    const doctor = new Doctor({
      name,
      email,
      password,
      specialization,
      profilePicture, // Add the image URL to the doctor object
    });

    await doctor.hashPassword(); // Hash the password
    await doctor.save(); // Save the doctor to the database

    res.status(200).json({ message: 'Doctor created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error while creating doctor', error });
  }
});

// POST /login - Doctor Login (no image handling)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: 'Doctor not found' });

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Error while logging in', error });
  }
});

// PUT /update/:id - Update Doctor Details with Profile Picture
router.put('/update/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Update doctor information
    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.specialization = specialization || doctor.specialization;

    if (password) {
      doctor.password = password;
      await doctor.hashPassword(); // Hash new password if provided
    }

    // Handle profile picture update
    if (req.file) {
      doctor.profilePicture = '/uploads/' + req.file.filename; // Update the profile picture
    }

    await doctor.save(); // Save the updated doctor information

    res.status(200).json({ message: 'Doctor updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error while updating doctor', error });
  }
});

// DELETE /delete/:id - Delete Doctor
router.delete('/delete/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error while deleting doctor', error });
  }
});

// GET / - Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    if (doctors.length === 0) return res.status(400).json({ message: 'No doctors found' });

    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error getting all doctors', error });
  }
});

module.exports = router;
