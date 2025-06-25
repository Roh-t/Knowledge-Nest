// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './configs/mongodb.js'
// import { clerkWebhooks } from './controllers/webhooks.js'

// //Initialize Express
// const app = express()

// // Middlewares
// app.use(cors())
// // Apply JSON parser middleware to all routes
// app.use(express.json());
// // Connect to database
// await connectDB()




// //Routes
// app.get('/',(req,res)=> res.send("API Working"))
// app.post('/clerk',clerkWebhooks)


// //Port
// const PORT = process.env.PORT || 5000

// app.listen(PORT, ()=> {
//     console.log(`Server is running on port ${PORT}`)
// })


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';


const app = express();

// Connect to DB
await connectDB();

// Middlewares
app.use(cors());

// Use raw body only for webhook route
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

// For all other routes, parse as JSON
app.use(express.json());

app.get('/', (req, res) => res.send("API Working"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
