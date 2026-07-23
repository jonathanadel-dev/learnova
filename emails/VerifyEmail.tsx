
function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function VerifyEmail({ name, verifyUrl }: { name: string; verifyUrl: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Verify your email to finish setting up Learnova</title>
      </head>
      <body style="background-color:#0a0a0d;font-family:sans-serif;padding:40px 0;margin:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="480"
                cellpadding="0"
                cellspacing="0"
                style="background-color:#141417;border-radius:8px;padding:32px;max-width:480px;"
              >
                <tr>
                  <td style="color:#f4f4f2;font-size:20px;font-weight:bold;padding-bottom:16px;">
                    Verify your email
                  </td>
                </tr>
                <tr>
                  <td style="color:#a1a1aa;font-size:14px;line-height:22px;">
                    Hi ${escapeHtml(name)}, click the link below to verify your Learnova account and unlock
                    the rest of the platform.
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;">
                    <a
                      href="${verifyUrl}"
                      style="display:inline-block;background-color:#635bff;color:#ffffff;font-size:14px;font-weight:600;padding:12px 20px;border-radius:6px;text-decoration:none;"
                    >
                      Verify email address
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:32px;">
                    <hr style="border:none;border-top:1px solid #26262b;margin:0 0 16px;" />
                  </td>
                </tr>
                <tr>
                  <td style="color:#71717a;font-size:12px;line-height:18px;">
                    This link expires in 48 hours. If you didn't create a Learnova account, you
                    can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `.trim()
}