const nodemailer = require("nodemailer");
const serverUrl = process.env.SERVER_URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const confirmOptions = (email, id) => ({
  to: `${email}`,
  from: "dnr.jobsforhope@gmail.com",
  subject: `Verify your account`,
  html: `<p>Hello, please click the following link to verify your account.</p>
		  <br>
		  <p><a href="${serverUrl}confirm/${id}">Verify Me</a></p>
		  <br>
		  <p>Thanks,</p>
		  <p>Jobs For Hope</p>`
});

const resetOptions = (email, id) => ({
  to: `${email}`,
  from: "dnr.jobsforhope@gmail.com",
  subject: `Password Reset`,
  html: `
		  <p>Please click the following link to reset your password.</p>
		  <br>
		  <p><a href='${serverUrl}api/auth/reset/${id}'>Reset</a></p>
		  <br>
		  <p>Thanks,</p>
		  <p>Jobs For Hope</p>`
});

module.exports = {
  transporter,
  confirmOptions,
  resetOptions
};
