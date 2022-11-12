const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    type: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Admin', userSchema)