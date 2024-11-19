const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    condition: { type: String },
    doctor:[{  type: mongoose.Schema.Types.ObjectId,  ref:"Doctor"}]
})

patientSchema.methods.hashPassword = async function () {
    this.password = await bcrypt.hash(this.password , 10);
};

patientSchema.methods.comparePassword= async function (inputPassword) {
    return await bcrypt.compare(inputPassword,this.password);
}

module.exports = mongoose.model('Patient' ,patientSchema)