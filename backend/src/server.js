import express from 'express';
import { ENV } from './config/env.js';

const app = express();

app.get("/api/health", (req, res) => {
    res.status(200).json({message:"success"})
})

app.listen(ENV.PORT, () => console.log("Server is up and running "))