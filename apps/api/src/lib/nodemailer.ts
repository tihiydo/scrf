import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

// console.log(process.env)
export const transporter: Transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'info@screenify.tv',
    pass: 'onel mvoo ewxj ivwx',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const generateMailOptions = (
  to: string[],
  subject: string,
  html: string,
): SendMailOptions => {
  return {
    from: 'info@screenify.tv',
    to,
    subject,
    html,
  };
};
