const express=require('express');
const jwt=require('jsonwebtoken');
const Patient = require ('../models/Patient');

const router = express.Router();

router.post('/register', async (req,res)=>{
    try {
        const {name,email,password,age,condition}=req.body;

        const existingPatient=await Patient.findOne({email});
        if(existingPatient) res.status(400).json({message:'patient already exist'})

        const patient = new Patient({name,email,password,age,condition});
        await patient.hashPassword();
        await patient.save();

        res.status(200).json({message:'Patient created'})


    } catch (error) {
        res.status(400).json({message:'error while creaing doctor',error});
    }
});





router.post('/login', async (req,res)=>{
    try {

        const {email,password}=req.body;

        const patient= await Patient.findOne({email});
        if(!patient) res.status(400).json({message:'doctor not found'});

        const isMatch = await patient.comparePassword(password);
        if(!isMatch) res.status(400).json({message:'invalid credentials'});


        const token=jwt.sign({id:patient._id,role:"patient"},process.env.JWT_SECRET,{expiresIn:"1h"})


        res.json({token});

    } catch (error) {
        console.error(error);
        res.status(400).json({message:'error while Log in ',error});
    }
})


router.put('/update/:id',async (req,res)=>{
    try {
        const {name,email,password,age,condition}=req.body;
        const patientId=req.params.id;

        const patient = await Patient.findById(patientId);
        if(!patient) return res.status(400).json({message:'patient not found',error});

        patient.name = name || patient.name;
        patient.age = age || patient.age;
        patient.email = email || patient.email;
        patient.condition = condition || patient.condition;

        if(password){
            patient.password=password;
            await patient.hashPassword();
        }

        await patient.save()
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'patient not updated',error})
    }
})


router.delete('/delete/:id',async (req,res)=>{
    try {

        const patientId=req.params.id;
        const patient = await Patient.findByIdAndDelete(patientId);
        if(!patient) return res.status(400).json({message:'patient not deletd '});
        res.status(200).json({message:'patient deleted'});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'patient not deleted',error})
    }
})

router.get('/', async (req,res)=>{
    try {
        const patient = await Patient.find();
        if(!patient) return res.status(400).json({message:'no patient found'})

        res.json(patient)
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'error while fetching all patients',error})
    }
})

module.exports = router;