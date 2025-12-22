import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express"

import { functions, inngest } from './config/inngest.js';
import adminRoutes from "./routes/admin.route.js"

const app = express();

app.use(express.json());
app.use(clerkMiddleware())

app.use("/api/inngest", serve({client:inngest, functions:functions}))

app.use("/api/admin", adminRoutes)

app.get("/api/health", (req, res) => {
    res.status(200).json({message:"success"})
})

// app.listen(ENV.PORT, () => {
//     console.log("Server is up and running ")
//     connectDB();
// })

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("Server is up and running ");
    });
};
startServer();