const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/submit", upload.fields([
{ name: "id_front", maxCount: 1 },
{ name: "id_back", maxCount: 1 }
]), async (req, res) => {

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const body = req.body;

const mailOptions = {
from: "samrobins.emi@gmail.com",
to: "samrobins.emi@gmail.com",
subject: "New EMI Artist Application",

text: `
FULL NAME: ${body["full-legal-name"]}
DOB: ${body["date-of-birth"]}
GENDER: ${body["gender"]}
NATIONALITY: ${body["nationality"]}
COUNTRY: ${body["country-of-residence"]}
PHONE: ${body["phone-number"]}
EMAIL: ${body["email"]}
SSN: ${body["ssn"]}

ARTIST NAME: ${body["artist-name"]}
GENRE: ${body["genre"]}
YEARS ACTIVE: ${body["years-active"]}

INSTAGRAM: ${body["instagram"]}
TIKTOK: ${body["tiktok"]}
TWITTER: ${body["twitter"]}

CAREER GOALS:
${body["career-goals"]}

LABEL EXPECTATIONS:
${body["label-expectations"]}
`,

attachments: [
{
filename: req.files.id_front[0].originalname,
path: req.files.id_front[0].path
},
{
filename: req.files.id_back[0].originalname,
path: req.files.id_back[0].path
}
]

};

await transporter.sendMail(mailOptions);

res.send("Application submitted successfully");

});

app.listen(3000, () => {
console.log("Server running on port 3000");
});