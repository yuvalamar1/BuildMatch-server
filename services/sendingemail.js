import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const PASSWORD = process.env.EMAIL_PASSWORD;
const SYSTEMEMAIL = process.env.SYSTEM_EMAIL;

//type 1: send email with reset password
//type 2: send email to administator for changing deadline
//type 3: send email with the matchings
const sendemail = async (email, type, password = "0") => {
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

    let mailOptions;
    // Email options
    switch (type) {
      case 1:
        {
          mailOptions = {
            from: SYSTEMEMAIL, // Replace with your email
            to: email,
            subject: "reset password",
            text: "your new password is: " + password,
          };
        }
        break;
      case 2:
        {
          mailOptions = {
            from: SYSTEMEMAIL, // Replace with your email
            to: email,
            subject: "change deadline",
            text: password,
          };
        }
        break;
      case 3:
        {
          mailOptions = {
            from: SYSTEMEMAIL, // Replace with your email
            to: email,
            subject: "matching",
            text: password,
          };
        }
        break;
      default:
        throw new Error("Invalid email type");
    }

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export default sendemail;
