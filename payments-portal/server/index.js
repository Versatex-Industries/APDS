require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const helmet = require('helmet');


const User = require('./models/User');
const Payment = require('./models/Payment');

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Register User
app.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// Login User
app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// Create Payment
app.post('/payment', auth, async (req, res, next) => {
  const { amount, currency, recipient } = req.body;
  try {
    const payment = new Payment({ amount, currency, recipient });
    await payment.save();
    res.status(201).json({ message: 'Payment processed successfully' });
  } catch (error) {
    next(error);
  }
});

// Get payment history
app.get('/payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
