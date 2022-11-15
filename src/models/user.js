const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if (!isEmail(value)) {
                throw new Error('This is not valid email')
            }
        }
    },
    password: {
        type: String,
        minLength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password has to be minimum 6 carakter.')
            }
        }
    },
    age: {
        type: Number,
        required: true
    },
    token: [{
        token: {
            type: String,
            required: true
        }
    }],
    image: {
        type: Buffer
    }
}, {
    timestamps: true
})

schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'creator'
})

schema.methods.toJSON = function() {
    const user = this.toObject()
    
    delete user.password;
    delete user.token
    delete user.image;

    return user
}

schema.methods.generateToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET_KEY) 
    this.token = [...this.token, {token}]
    this.save()
    return token;
}

schema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error({'error': 'user not found'})
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new Error({'error': 'password not matched!'})
    }

    return user;
}

schema.pre('save', async function(next){
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    
    next()
})

schema.pre('remove', async function(next){
    await Task.deleteMany({creator: this._id})
    next()
})

// schema.post('save', async function(next){

//     console.log('after saving user');

//     next()

// })

const User = mongoose.model('User', schema)

module.exports = User;