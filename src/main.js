import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000; // ✅ Use Render's assigned port

// ✅ Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// ✅ Serve index.html as the default page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Use environment variables for credentials (avoid hardcoding passwords!)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,  // ✅ Use env variable
        pass: process.env.EMAIL_PASS,  // ✅ Use env variable
    },
});

// ✅ POST /send-order endpoint
app.post("/send-order", (req, res) => {
    const { name, address, postcode, city, orderDetails } = req.body;

    if (!name || !address || !postcode || !city || !orderDetails) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const validPostcodes = ["702 31", "702 30", "702 29"];
    if (!validPostcodes.includes(postcode)) {
        return res.status(400).json({ message: "Invalid postcode." });
    }

    const mailOptions = {
        from: fikastundenmail@gmail.com,  // ✅ Secure email sender
        to: fikastundenmail@gmail.com,    // ✅ Secure email receiver
        subject: `New Order from ${name}`,
        text: `
        You received a new order:
        Name: ${name}
        Address: ${address}
        Postcode: ${postcode}
        City: ${city}
        Order Details:
        ${orderDetails}
        Total Items: ${orderDetails.length}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Failed to send the order email." });
        }

        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Order received and email sent successfully!" });
    });
});

// ✅ Keep only one `app.listen()`
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});