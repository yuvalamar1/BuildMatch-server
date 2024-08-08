import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const PASSWORD = process.env.EMAIL_PASSWORD;
const SYSTEMEMAIL = process.env.SYSTEM_EMAIL;
const sendemail = async (email, password = "0") => {
  try {
    // Set up email transporter
    const transporter = nodemailer.createTransport({
      //   service: "smtp.mailfence.com",
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: SYSTEMEMAIL, // Replace with your email
        pass: PASSWORD, // Replace with your email password
      },
    });

    // Email options
    const mailOptions = {
      from: SYSTEMEMAIL, // Replace with your email
      to: email,
      subject: "reset password",
      text: "your new password is: " + password,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export default sendemail;
