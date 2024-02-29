const AWS = require("aws-sdk");
const axios = require('axios');

const awsConfig = {
    accessKeyId: process.env.awsAccessKey,
    secretAccessKey: process.env.awsSecretkey,
    region: process.env.awsMailRegion,
}

const SES = new AWS.SES(awsConfig);
// const sendEmail = async (options) => {
//     try {
//       const mailOptions = {
//         Source: options.from,
//         Destination: {
//           ToAddresses: [options.to],
//         },
//         Message: {
//           Subject: {
//             Data: options.subject,
//           },
//           Body: {
//             Html: {
//               Data: options.text,
//             },
//           },
//         },
//       };
  
//       return await SES.sendEmail(mailOptions).promise(); // Utilize promise method
//     } catch (error) {
//       console.log(error);
//       throw new Error("Failed to send email");
//     }
//   };
const sendEmail = async (options) => {
  try {
    const postData = {
      From: 'info@ffpmethod.com',
      To: options.to,
      Subject: options.subject,
      TextBody: options.text,
      HtmlBody: options.text,
      MessageStream: 'outbound',
    };

    const response = await axios.post('https://api.postmarkapp.com/email', postData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.Postmark_Token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;

// const nodeMailer = require("nodemailer")

// const sendEmail = async(options)=>{

//     const transporter  = nodeMailer.createTransport({

//         host:process.env.SMPT_HOST,
//         port:465,
//         service:process.env.SMPT_SERVICE,
//         auth:{
//             user:process.env.SMPT_MAIL,
//             pass:process.env.SMPT_PASSWORD
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     })

//     const mailOptions  = {

//         from:"",
//         to:options.email,
//         subject:options.subject,
//         text:options.message
//     }

//   await transporter.sendMail(mailOptions);

// };

// module.exports = sendEmail