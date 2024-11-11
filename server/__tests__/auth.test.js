const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

// Utility sleep function to add delay in ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 5000,
    });
});

beforeEach(async () => {
    // Ensure the users are fully deleted before each test
    await User.deleteMany({ username: { $in: ['testuser', 'employeeUser'] } });
    await sleep(100);  // Add a 100 ms delay to ensure deletion completes
});

afterAll(async () => {
    await mongoose.connection.close(); // Ensure all connections are closed
});

describe('Auth API', () => {
    it('should successfully create a regular user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'Test1234',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('User registered successfully');
    });

    it('should login an existing regular user', async () => {
        // Ensure the user is created first
        await request(app).post('/register').send({
            username: 'testuser',
            password: 'Test1234',
        });

        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'Test1234',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });


});
