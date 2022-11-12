const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    noidung:{
        type:String,
    },
   
    date:{
        type:Date,
        default:Date.now
    }
})
userSchema.index({ noidung: "text" })
module.exports = mongoose.model('Lichsunaptien',userSchema)