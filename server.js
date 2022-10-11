import express from 'express'
// import { readdirSync } from 'fs'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRouter from './routes/authRoutes.js'
import hotelRouter from './routes/hotelRoutes.js'
import stripeRouter from './routes/stripeRoutes.js'

// Need these to help setup static assets middleware 
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

// Need to install morgan using this syntax because esm is installed
// const morgan = require('morgan')

dotenv.config()

const app = express()

// db connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,        
        useUnifiedTopology: true        
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("DB Connection Error: ", err))

// middleware

// morgan is a Node.js and Express middleware to log HTTP requests and errors
// if (process.env.NODE_ENV !== "production") {
//     app.use(morgan("dev"))
// }
// Allows client and server to communicate with each other across different origins
app.use(cors())

// Built-in middleware function in Express that parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json())

// Setup up __dirname
const __dirname = dirname(fileURLToPath(import.meta.url))

// Use when ready to deploy - middleware that serves static assets (build folder)
app.use(express.static(path.resolve(__dirname, './client/build')))

// route middleware
// Read all routes from routes folder
// readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)))

app.use("/api", authRouter)
app.use("/api", hotelRouter)
app.use("/api", stripeRouter)

// Use when ready to deploy - needs to come after the routes specified above
// Redirects all other routes to index.html - needed for react router to work
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))