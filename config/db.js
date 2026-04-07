const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI ko .env file se uthayega
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Agar connection fail ho toh process exit kar do (1 means failure)
    process.exit(1);
  }
};

module.exports = connectDB;