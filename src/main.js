import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Email setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/send-order", (req, res) => {
    const { name, address, postcode, city, orderDetails } = req.body;

    if (!name || !address || !postcode || !city || !orderDetails) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Order from ${name}`,
        text: `You received a new order from ${name}.\n\nAddress: ${address}\nPostcode: ${postcode}\nCity: ${city}\n\nOrder Details:\n${orderDetails}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Failed to send order email." });
        }
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Order received and email sent successfully!" });
    });
});

// ✅ Ensure only ONE `app.listen()` call exists
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});