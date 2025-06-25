import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Enable CORS
app.use(cors());

// 🛑 Parse JSON only for non-webhook routes
// 🟢 Clerk requires raw body for webhook validation
app.post('/', express.raw({ type: 'application/json' }), clerkWebhooks);

// All other routes use express.json()
app.use(express.json());

// Test route
app.get('/', (req, res) => res.send("API Working"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
