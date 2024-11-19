const express =require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const doctorRoutes=require('./routes/doctorRoutes')
const patientRoutes=require('./routes/patientRoutes')
const adminRoutes = require('./routes/adminRoutes'); 

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


const app = express();
app.use(express.json());

app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/admin', adminRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));