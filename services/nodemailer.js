const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD
	}
});

const mailOptions = (email, id) => ({
	to: `${email}`,
	from: "dnr.jobsforhope@gmail.com",
	subject: `Verify your account`,
	html: `<p>Hello, please click the following link to verify your account.</p>
		  <br>
		  <p><a href='http://localhost:5000/api/auth/confirm/${id}'>Verify Me</a></p>
		  <br>
		  <p>Thanks,</p>
		  <p>Jobs For Hope</p>`
});

module.exports = {
	transporter,
	mailOptions
};
