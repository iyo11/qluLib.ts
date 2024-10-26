import nodemailer from 'nodemailer';

export class MailClient {
    async sendMail(data: MailData) {
        // 创建一个 Nodemailer 运输器
        let transporter = nodemailer.createTransport({
            host: data.host,
            port: data.port,
            secure: data.enableSsl, // true for 465, false for other ports
            auth: {
                user: data.fromAddress, // 用户名
                pass: data.password, // 密码
            }
        });


        // 设置邮件内容
        let mailOptions;
        if (data.isBodyHtml) {
            mailOptions = {
                from: `${data.name ?? ''} <${data.fromAddress}>`, // 发件人地址
                to: data.to, // 收件人地址
                subject: data.subject, // 邮件主题
                text: data.body, // 普通文本内容

            };
        }
        else {
            mailOptions = {
                from: `${data.name ?? ''} <${data.fromAddress}>`, // 发件人地址
                to: data.to, // 收件人地址
                subject: data.subject, // 邮件主题
                html: data.body, // HTML 内容
            };
        }

        // 发送邮件
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    }
}

export class MailData {
    to!: string[]; // 对应 List<string> in C#
    subject!: string;
    body!: string;
    host!: string;
    port!: number;
    fromAddress!: string;
    password!: string;
    enableSsl!: boolean;
    isBodyHtml!: boolean;
    verified?: boolean;
    name?: string;

}