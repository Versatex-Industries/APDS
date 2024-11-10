const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 5000,
    });
    const res = await request(app)
        .post('/login')
        .send({
            username: 'testuser',
            password: 'Test1234',
        });
    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.close(); // Ensure all connections are closed
});

describe('Payment API', () => {
    it('should create a payment when authenticated', async () => {
        const res = await request(app)
            .post('/payment')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 100,
                currency: 'USD',
                recipient: 'recipient@example.com',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('Payment processed successfully');
    });

    it('should not create a payment without authentication', async () => {
        const res = await request(app)
            .post('/payment')
            .send({
                amount: 100,
                currency: 'USD',
                recipient: 'recipient@example.com',
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Access denied');
    });
});
