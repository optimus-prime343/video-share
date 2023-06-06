import type { SendMailOptions, SentMessageInfo } from 'nodemailer'
import nodemailer from 'nodemailer'

export const sendMail = async (options: SendMailOptions): Promise<SentMessageInfo> => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    from: process.env.MAIL_FROM,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })
  const info = await transport.sendMail(options)
  return info
}
