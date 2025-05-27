require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { fname, city, phone, email, message, site } = req.body;

  if (!fname || !city || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    host: site ? process.env.CUSTOM_SMTP_HOST : process.env.SMTP_HOST,
    port: site ? Number(process.env.CUSTOM_SMTP_PORT) : Number(process.env.SMTP_PORT),
    secure: site ? true : false,
    auth: {
      user: site === "elektrotechnik-kissel.de" ? process.env.CUSTOM_SMTP_USERNAME_1 : site === "kammerjaeger-brinkmann.de" ? process.env.CUSTOM_SMTP_USERNAME_2 : site === "klempner-albrecht.de" ? process.env.CUSTOM_SMTP_USERNAME_3 : process.env.SMTP_USERNAME,
      pass: site ? process.env.CUSTOM_SMTP_PASSWORD : process.env.SMTP_PASSWORD,
    },
  });

  let toEmail = "shivamui.webforest@gmail.com";
  let fromEmail = process.env.SMTP_EMAIL_FROM;
  if (site === "elektrotechnik-kissel.de") { toEmail = "kontakt@elektrotechnik-kissel.de", fromEmail = "kontakt@elektrotechnik-kissel.de" }
  else if (site === "kammerjaeger-brinkmann.de") { toEmail = "kontakt@kammerjaeger-brinkmann.de", fromEmail = "kontakt@kammerjaeger-brinkmann.de" }
  else if (site === "klempner-albrecht.de") { toEmail = "kontakt@klempner-albrecht.de", fromEmail = "kontakt@klempner-albrecht.de" }

  const mailOptions = {
    from: fromEmail,
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
