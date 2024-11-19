const mongooose = require('mongoose');
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    specialization:{type:String,required:true},
    profilePicture: { type: String, default: '' }
})

doctorSchema.methods.hashPassword = async function () {
    this.password=await bcrypt.hash(this.password,10);
}

doctorSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword,this.password);
}

module.exports = mongoose.model('Doctors', doctorSchema)