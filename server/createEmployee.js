// Import necessary modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
const User = require('./models/User'); // Adjust this path based on your project structure

// MongoDB connection URI
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/paymentsDB';

// Set up readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for input
function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

// Function to create a new employee
async function createEmployee() {
    try {
        // Connect to the database
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to the database.');

        // Get user input
        const username = await askQuestion('Enter username for the employee: ');
        const password = await askQuestion('Enter password for the employee: ');

        // Check if the employee already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Employee already exists.');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new employee user
        const employee = new User({
            username,
            password: hashedPassword,
            role: 'employee' // Default role as 'employee'
        });

        // Save the employee to the database
        await employee.save();
        console.log('Employee created successfully:', employee.username);

    } catch (error) {
        console.error('Error creating employee:', error);
    } finally {
        // Disconnect from the database and close readline
        await mongoose.disconnect();
        rl.close();
        console.log('Disconnected from the database.');
    }
}

// Run the function
createEmployee();
