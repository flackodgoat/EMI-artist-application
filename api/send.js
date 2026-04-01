import nodemailer from "nodemailer";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({
    uploadDir: "/tmp",           // Important for Vercel
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ success: false, error: "Form parsing error" });
    }

    // fields come as arrays → take [0]
    const name = fields.name?.[0] || "No name";
    const email = fields.email?.[0] || "";
    const message = fields.message?.[0] || "No message";

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Build attachments if user uploaded files
      const attachments = [];
      if (files) {
        Object.values(files).flat().forEach((file) => {
          if (file && file.filepath) {
            attachments.push({
              filename: file.originalFilename || "uploaded-file",
              path: file.filepath,
            });
          }
        });
      }

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: process.env.EMAIL_USER,
        subject: "New EMI Artist Submission",
        html: `
          <h2>New Artist Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><em>Files attached: ${attachments.length > 0 ? attachments.length : "None"}</em></p>
        `,
        attachments,   // ← files will be attached to the email
      });

      console.log("✅ Email sent successfully");
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("EMAIL ERROR:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
}