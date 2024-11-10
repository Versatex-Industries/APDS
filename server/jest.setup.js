// jest.setup.js
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Shorter timeout for tests
        heartbeatFrequencyMS: 5000,     // Reduce heartbeat interval to avoid open handles
    });
});
