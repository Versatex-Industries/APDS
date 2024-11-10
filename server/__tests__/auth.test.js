const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

beforeAll(async () => {
    jest.setTimeout(30000);
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 5000,
    });
    await User.deleteOne({ username: 'testuser' }); // Ensure no duplicate user
});

afterAll(async () => {
    await mongoose.connection.close(); // Ensure all connections are closed
});

describe('Auth API', () => {
    it('should successfully create a user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'Test1234',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('User registered successfully');
    });

    it('should login an existing user', async () => {
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
