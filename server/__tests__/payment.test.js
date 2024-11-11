const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

let userToken;
let employeeToken;

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 5000,
    });

    // Register and log in a regular user
    await User.deleteOne({ username: 'testuser' });
    await request(app)
        .post('/register')
        .send({
            username: 'testuser',
            password: 'Test1234',
        });

    const loginResponse = await request(app)
        .post('/login')
        .send({
            username: 'testuser',
            password: 'Test1234',
        });

    userToken = loginResponse.body.token;

    // Register and log in an employee user
    await User.deleteOne({ username: 'employeeUser' });
    await request(app)
        .post('/register')
        .send({
            username: 'employeeUser',
            password: 'Employee1234',
            role: 'employee'
        });

    const employeeLoginResponse = await request(app)
        .post('/login')
        .send({
            username: 'employeeUser',
            password: 'Employee1234',
        });

    employeeToken = employeeLoginResponse.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Payment API', () => {
    it('should create a payment when authenticated as a regular user', async () => {
        const res = await request(app)
            .post('/payment')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                amount: 100,
                currency: 'USD',
                sender: 'testuser',
                recipient: 'employeeUser',
            });

        console.log('Payment Creation Response:', res.statusCode, res.body);
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('Payment processed successfully');
    });

    it('should fetch payments specific to the user when authenticated as a regular user', async () => {
        const res = await request(app)
            .get(`/payments/testuser`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    sender: 'testuser',
                    recipient: 'employeeUser',
                    amount: 100,
                    currency: 'USD'
                })
            ])
        );
    });



    it('should restrict non-employee users from fetching all payments', async () => {
        const res = await request(app)
            .get('/payments')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe('Access denied');
    });
});
