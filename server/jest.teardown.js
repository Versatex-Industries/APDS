// jest.teardown.js
const mongoose = require('mongoose');

module.exports = async () => {
    await mongoose.connection.close(); // Close the MongoDB connection
    await mongoose.disconnect();       // Ensure all connections are terminated
};
