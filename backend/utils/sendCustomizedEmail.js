const nodemailer = require("nodemailer");
const MailGen = require("mailgen");

const sendCustomizedEmail = async (subject, send_to, template, reply_to, customizedLogo, teamName, cc) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Create Template with Mailgen
  const mailGenerator = new MailGen({
    theme: "default",
    product: {
      name: `ultratradex Platform`,
      link: "https://ultratradex.io/",
      // Optional product logo
      logo: customizedLogo,
       // Custom logo height
      logoHeight: '70px'
    },
  });

  const emailTemplate = mailGenerator.generate(template);
  require("fs").writeFileSync("preview.html", emailTemplate, "utf8");

  //Options for sending email
  const options = {
    from: `ultratradex <${process.env.EMAIL_USER}>` ,
    to: send_to,
    replyTo: reply_to,
    subject,
    html: emailTemplate,
    cc,
  };

  //send Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};


module.exports = sendCustomizedEmail;
