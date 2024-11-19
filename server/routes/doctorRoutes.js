const express=require('express');
const jwt=require('jsonwebtoken');
const Doctor = require ('../models/Doctor');

const router = express.Router();

router.post('/register', async (req,res)=>{
    try {
        const {name,email,password,specialization}=req.body;

        const existingDoctor=await Doctor.findOne({email});
        if(existingDoctor) res.status(400).json({message:'doctor already exist'})

        const doctor = new Doctor({name,email,password,specialization})
        await doctor.hashPassword();
        await doctor.save();

        res.status(200).json({message:'doctor created'})


    } catch (error) {
        console.error(error);
        res.status(400).json({message:'error while creaing doctor' ,error});
    }
});

router.post('/login', async (req,res)=>{
    try {

        const {email,password}=req.body;

        const doctor= await Doctor.findOne({email});
        if(!doctor) res.status(400).json({message:'doctor not found'});

        const isMatch = await doctor.comparePassword(password);
        if(!isMatch) res.status(400).json({message:'invalid credentials'});


        const token=jwt.sign({id:doctor._id,role:"doctor"},process.env.JWT_SECRET,{expiresIn:"1h"})


        res.json({token});

    } catch (error) {
        res.status(400).json({message:'error while Log in ',error});
    }
});


router.put('/update/:id', async (req, res) => {
    try {
        const { name, email, password, specialization } = req.body;
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;
        doctor.specialization = specialization || doctor.specialization;

        if (password) {
            doctor.password = password;
            await doctor.hashPassword(); 
        }

        await doctor.save();

        res.status(200).json({ message: 'Doctor updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error while updating doctor', error });
    }
});

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


router.get('/',async (req,res)=>{
    try{
        const doctor=await Doctor.find();
        if(doctor===0)res.status(400).json({message:'no doctors'})
        res.status(200).json(doctor)
        
    }catch(error)
    {
        console.log(error)
        res.status(400).json({message:'error getting all doctors',error})
    }
})



module.exports = router;