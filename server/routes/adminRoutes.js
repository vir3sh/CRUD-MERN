const express=require('express')
const router=express.Router();
const jwt=require('jsonwebtoken');
const Admin = require('../models/Admin');
const { route } = require('./adminRoutes');

router.post('/register',async(req,res)=>{
    try {
        const{email,password}=req.body;
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin) res.status(400).json({message:"admin already exist"});

        const admin=new Admin({email,password})
        await admin.hashPassword();
        await admin.save();
        res.status(400).json({message:'admin created'})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'couldnot regsiter admin'});
        
    }
});

router.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body;

        const admin = await Admin.findOne({email});
        if(!admin) res.status(400).json({message:'admin does not exist'})

        const isMatch = await admin.comparePassword(password)
        if(!isMatch) res.status(400).json({message:'invalid credentials'})

        const token=jwt.sign({id:admin._id,role:"admin"},process.env.JWT_SECRET,{expiresIn:"1h"})


        res.status(200).json({message:"admin logged in"})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'couldnot login admin'});
    }
});


router.delete('/delete:id',async(req,res)=>{
    try {
        const adminId=req.params.id;

        const admin = await Admin.findByIdAndDelete(adminId)
        if(!admin) res.status(400).json({message:'admin does not exist'})
            res.status(200).json({message:'admin deleted'});

    } catch (error) {
        console.log(error);
        res.status(400).json({message:'couldnot delete admin'});  
    }
});

router.put('/update/:id',async(req,res)=>{
    try {
        const {email,password}=req.body;
        const adminId=req.params.id;

        const admin = await Admin.findById(adminId);
        if(!admin) return res.status(404).json({message:'admin not found'});

        admin.email=email || admin.email;

        if(password){
            admin.password=password;
            await admin.hashPassword();
        }

        await admin.save();

        res.status(200).json({ message: 'admin updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'couldnot update admin',error});  
    }
})



router.get('/',async(req,res)=>{
    try {
        const admin = await Admin.find();
        if(admin===0) res.status(400).json({message:'no admin found with this mail'});
        res.status(200).json(admin);

    } catch (error) {
        console.log(error);
        res.status(400).json({message:'error while fetching admins'}); 
    }
})

module.exports=router;