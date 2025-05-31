const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 