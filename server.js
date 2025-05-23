require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLS uses port 587 usually, secure false for STARTTLS
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

app.post("/send-email", async (req, res) => {
  const { fname, city, phone, email, message, site } = req.body;

  if (!fname || !city || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let toEmail = "shivamui.webforest@gmail.com";
  if (site === "elektrotechnik-kissel.de") { toEmail = "kontakt@elektrotechnik-kissel.de" }
  else if (site === "kammerjaeger-brinkmann.de") { toEmail = "kontakt@kammerjaeger-brinkmann.de" }
  else if (site === "klempner-albrecht.de") { toEmail = "kontakt@klempner-albrecht.de" }

  const mailOptions = {
    from: process.env.SMTP_EMAIL_FROM,
    to: toEmail,
    subject: `Message from ${fname}`,
    text: `
      Name: ${fname}
      City: ${city}
      Phone: ${phone}
      Email: ${email}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
