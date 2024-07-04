import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const salt = bcryptjs.genSaltSync(10);
    const hashedToken = bcryptjs.hashSync(userId.toString(), salt);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // expiry 1 hours
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 600000, //expiry 10 mins
        },
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "49f8587bc4bf6a", //❌
        pass: "3de4470ab18533", //❌
      },
    });

    // Set up email data
    let mailOptions = {
      from: "theperfectblue.in@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",

      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">Here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy & paste the below link in your browser
      <br>
      ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("mail response", mailResponse);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
