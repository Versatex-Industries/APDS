require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function createUser() {
    try {
        const user = new User({
            username: 'employee1', // Change as necessary
            password: 'SecurePassword1' // Plain text password will be hashed
        });
        await user.save();
        console.log('User created successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createUser();
