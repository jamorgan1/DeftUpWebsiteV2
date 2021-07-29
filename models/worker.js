const mongoose = require('mongoose')

const workerSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        default: "Customer",
        required: false
    },
})

module.exports = mongoose.model('Worker', workerSchema)