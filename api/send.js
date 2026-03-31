import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: email,
    to: process.env.EMAIL_USER,
    subject: "New EMI Artist Submission",
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
`
  });

  res.status(200).json({ success: true });
}