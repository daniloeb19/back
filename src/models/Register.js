const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    temp: Number,
    date: String,
    hour: String
}, {
    timestamps: true,
    toJSON: { getters: true }
});






const registers = mongoose.model('registers', DataSchema);
module.exports = registers;