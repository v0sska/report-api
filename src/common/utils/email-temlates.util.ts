export class EmailTemplateUtil {
  public static inviteTemplate(role: string, link: string, subject: string) {
    return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #000000;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #121212;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        h1 {
          color: #00ff00;
          text-align: center;
          font-size: 28px;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          text-align: center;
          margin-bottom: 20px;
          color: #ffffff;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #00ff00;
          color: #000000;
          text-decoration: none;
          font-size: 16px;
          font-weight: bold;
          border-radius: 5px;
          text-align: center;
          margin: 0 auto;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #00cc00;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello!</h1>
        <p>
          You have been invited to join the <strong>${role}</strong> team at
          <strong>OSA</strong>.
        </p>
        <p>
          We are excited to have you on board and look forward to working with you!
        </p>
        <p>Click the button below to accept the invitation and get started:</p>
        <p>
          <a href="${link}" class="button">Accept Invitation</a>
        </p>
        <p>
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; color: #00ff00;">${link}</p>
        <div class="footer">
          <p>Best regards,<br />The OSA Team</p>
        </div>
      </div>
    </body>
  </html>
  `;
  }
}
