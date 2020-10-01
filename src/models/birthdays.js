const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const birthdaySchema = new Schema({
    _id: ObjectId,
    name: String,
    birthday: String,
    age: String,
    date: Date
});

module.exports = mongoose.model('birthday', birthdaySchema);
