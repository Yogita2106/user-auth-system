const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const auth = require('./middleware/authMiddleware');

// 1. Configuration Setup
dotenv.config();
const app = express();

// 2. Middlewares
app.use(cors()); 
app.use(express.json()); 

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); 
    });

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 5. Protected Route
app.get('/api/profile', auth, (req, res) => {
    res.json({ 
        message: "Welcome to your protected profile!", 
        user: req.user 
    });
});

// 6. Base Route (Health Check)
app.get('/', (req, res) => {
    res.send("Auth & CRUD API is running...");
});

// 7. Server Port Setup (FIXED FOR RENDER)
const PORT = process.env.PORT || 5000;

// Render ke liye '0.0.0.0' host specify karna best practice hai
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Local testing ke liye localhost dikhayega, Render par ye auto-handle ho jayega
    console.log(`🔗 API Base URL: http://0.0.0.0:${PORT}/api`);
});