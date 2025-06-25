import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

//Initialize Express
const app = express()

// Middlewares
app.use(cors())
// Apply JSON parser middleware to all routes
app.use(express.json());
// Connect to database

await connectDB()

//Routes
app.get('/',(req,res)=> res.send("API Working"))
app.post('/',clerkWebhooks)


//Port
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})