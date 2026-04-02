const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username must be unique'],
        match: [/^[a-zA-Z0-9_]{3,25}$/, 'Username must be between 3 and 25 characters and contain only letters, numbers, and underscores'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profilePicture: {
        type: String,
        default: '',
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, 'Gender is required'],
    },

    connectedUsers: [],
    personalChat: [],

    date: {
        type: Date,
        default: Date.now,
    },

    time: {
        type: String,
        default: new Date().toLocaleTimeString(),
    },
});


const UsersCollection = mongoose.model('User', userSchema);

module.exports = UsersCollection;