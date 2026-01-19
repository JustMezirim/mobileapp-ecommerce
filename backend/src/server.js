import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express"

import { functions, inngest } from './config/inngest.js';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.use("/api/inngest", serve({client:inngest, functions:functions}))

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({message:"success"})
})

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("Server is up and running ");
    });
};
startServer();