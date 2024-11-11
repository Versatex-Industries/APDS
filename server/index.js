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

app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ message: 'Access denied' });
  }

  if(user.role == 'employee') {
    return res.status(403).json({ message: 'Please use Employee Login' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

// Create Payment
app.post('/payment', auth, async (req, res, next) => {
  const { amount, currency, recipient, sender } = req.body;

  try {
    const payment = new Payment({ amount, currency, sender, recipient });
    await payment.save();
    res.status(201).json({ message: 'Payment processed successfully' });
  } catch (error) {
    next(error);
  }
});

// Get payment history
app.get('/payments/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find payments where the user is either the sender or the receiver
    const payments = await Payment.find({
      $or: [
        { sender: username, receiver: { $ne: username } }, // User is sender but not receiver
        { receiver: username, sender: { $ne: username } }  // User is receiver but not sender
      ]
    });
    console.log("PAYMENTS")
    console.log(payments)

    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }
    // Respond with the list of payments
    res.json(payments);
  } catch (error) {
    console.error(`Error fetching payments for ${username}:`, error);
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
});

// Get payment history
app.get('/payments', async (req, res) => {
  try {
    // Find payments where the user is either the sender or the receiver
    const payments = await Payment.find({});

    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }
    // Respond with the list of payments
    res.json(payments);
  } catch (error) {
    console.error(`Error fetching payments for`, error);
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
});

app.post('/employee-login', async (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);
  const user = await User.findOne({ username, role: 'employee' });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.get('/user-profile', async (req, res) => {
  const user = await User.findById(req.user.id).select('role username');
  res.json(user);
});


app.use(errorHandler);

module.exports = app;