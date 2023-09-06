import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export async function SendEmail(
  emailClient: string,
  clientName: string,
  content: string,
) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });

  var mailOptions = {
    from: '"WEB" <huynhanhpham734@gmail.com>',
    to: emailClient,
    subject: 'My Company',
    text: 'Tài khoản đăng nhập',
    html: `<p><i>Hi! ${clientName}</i></p><b>${content}</b><p><i>Welcome</i></p>`,
  };

  const sendEmail = await transporter.sendMail(mailOptions);

  if (!sendEmail) {
    throw new HttpException(`Send email no success !`, HttpStatus.BAD_REQUEST);
  }
  console.log('Email sent: ' + sendEmail?.response);
}
