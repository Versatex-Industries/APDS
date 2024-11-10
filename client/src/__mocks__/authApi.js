// src/__mocks__/authApi.js
module.exports = {
    login: jest.fn(() => Promise.resolve({ token: 'fake-jwt-token' })),
};
