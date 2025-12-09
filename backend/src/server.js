import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/health", (req, res) => {
    res.status(200).json({message:"success"})
})

// make our app ready for deployment
if(ENV.NODE_ENV === "production"){
    const adminPath = path.join(__dirname, "../../admin/dist");
    app.use(express.static(adminPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(adminPath, "index.html"));
    })
}

app.listen(ENV.PORT, () => console.log("Server is up and running "))