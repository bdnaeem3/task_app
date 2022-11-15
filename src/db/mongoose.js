const mongoose = require('mongoose');
const { isEmail, isPassword } = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    // useCreateIndex: true
})