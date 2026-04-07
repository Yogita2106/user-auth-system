const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Frontend connection ke liye zaroori
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const auth = require('./middleware/authMiddleware');

// 1. Configuration Setup
dotenv.config();
const app = express();

// 2. Middlewares
app.use(cors()); // CORS ko sabse pehle rakha hai taaki errors na aayein
app.use(express.json()); // JSON data handle karne ke liye

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); // Agar DB connect nahi hua toh server stop kar do
    });

// 4. API Routes
// Authentication Routes (Register/Login)
app.use('/api/auth', authRoutes);

// Task CRUD Routes (Create, Read, Update, Delete)
app.use('/api/tasks', taskRoutes);

// 5. Protected Route (Testing ke liye)
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

// 7. Server Port Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});