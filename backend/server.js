const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// CORS configuration - restrict to allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      ['http://localhost:3000', 'http://localhost:8080'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  const db = require('./db');
  const health = await db.healthCheck();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: health
  });
});

app.use("/api/scenario",
  require("./routes/scenario"));

app.use("/api/user",
  require("./routes/user"));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
