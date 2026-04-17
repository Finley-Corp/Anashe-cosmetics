import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM = process.env.RESEND_FROM_EMAIL?.trim() || 'Anashe <onboarding@resend.dev>';

function baseTemplate(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anashe</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f7;font-family:Inter,Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#1a1a1a;padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Anashe</p>
              <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;">Beauty Essentials</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f0f0f0;background:#fafafa;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                Anashe Cosmetics &mdash; Nairobi, Kenya<br />
                <a href="https://siscom.africa" style="color:#9ca3af;text-decoration:none;">siscom.africa</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function pill(text: string, color = '#1a1a1a') {
  return `<span style="display:inline-block;background:${color}15;color:${color};border-radius:100px;padding:3px 12px;font-size:12px;font-weight:600;text-transform:capitalize;">${text}</span>`;
}

function lineItem(label: string, value: string, bold = false) {
  return `<tr>
    <td style="padding:8px 0;font-size:14px;color:#6b7280;">${label}</td>
    <td style="padding:8px 0;font-size:14px;text-align:right;${bold ? 'font-weight:700;font-size:16px;color:#1a1a1a;' : 'color:#1a1a1a;'}">${value}</td>
  </tr>`;
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName?: string | null;
  orderNumber: string;
  total: number;
  items?: Array<{ product_name: string; quantity: number; unit_price: number }>;
}) {
  if (!resend) {
    console.warn('[Resend] Skipped — RESEND_API_KEY not configured.');
    return { success: false, skipped: true };
  }

  const customer = params.customerName?.trim() || 'there';
  const totalFormatted = `KES ${Number(params.total).toLocaleString('en-KE')}`;

  const itemsHtml =
    params.items && params.items.length > 0
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-top:1px solid #f0f0f0;">
          ${params.items
            .map(
              (item) => `<tr>
              <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f9f9f7;">
                ${item.product_name} <span style="color:#9ca3af;">× ${item.quantity}</span>
              </td>
              <td style="padding:10px 0;font-size:14px;text-align:right;color:#1a1a1a;border-bottom:1px solid #f9f9f7;">
                KES ${(item.unit_price * item.quantity).toLocaleString('en-KE')}
              </td>
            </tr>`
            )
            .join('')}
        </table>`
      : '';

  const body = `
    <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1a1a1a;">Order Confirmed!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hi ${customer}, thank you for shopping with Anashe.</p>

    <div style="background:#f9f9f7;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;">Order reference</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:0.04em;">${params.orderNumber}</p>
    </div>

    ${itemsHtml}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      ${lineItem('Total', totalFormatted, true)}
    </table>

    <div style="margin-top:28px;padding:16px 20px;background:#f0fdf4;border-radius:10px;border-left:3px solid #16a34a;">
      <p style="margin:0;font-size:14px;color:#166534;">
        Your order is being prepared. We will send you a confirmation once it's on its way.
      </p>
    </div>

    <p style="margin:28px 0 0;font-size:14px;color:#6b7280;">
      Questions? Reply to this email or contact us at
      <a href="mailto:hello@siscom.africa" style="color:#1a1a1a;font-weight:600;">hello@siscom.africa</a>.
    </p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Order ${params.orderNumber} confirmed — Anashe`,
      html: baseTemplate(body),
    });

    if (error) {
      console.error('[Resend] Order email error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error('[Resend] Order email exception:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendBookingConfirmationEmail(params: {
  to: string;
  customerName: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
}) {
  if (!resend) {
    console.warn('[Resend] Skipped — RESEND_API_KEY not configured.');
    return { success: false, skipped: true };
  }

  const body = `
    <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1a1a1a;">Booking Received!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hi ${params.customerName}, we have received your booking request.</p>

    <div style="background:#f9f9f7;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${lineItem('Service', params.serviceType)}
        ${lineItem('Date', params.preferredDate)}
        ${lineItem('Time', params.preferredTime)}
      </table>
    </div>

    <div style="margin-top:4px;padding:16px 20px;background:#eff6ff;border-radius:10px;border-left:3px solid #2563eb;">
      <p style="margin:0;font-size:14px;color:#1d4ed8;">
        ${pill('Pending Confirmation', '#2563eb')}
        &nbsp;We will confirm your appointment within 24 hours.
      </p>
    </div>

    <p style="margin:28px 0 0;font-size:14px;color:#6b7280;">
      Need to reschedule or have questions? Contact us at
      <a href="mailto:hello@siscom.africa" style="color:#1a1a1a;font-weight:600;">hello@siscom.africa</a>.
    </p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Your ${params.serviceType} booking — Anashe`,
      html: baseTemplate(body),
    });

    if (error) {
      console.error('[Resend] Booking email error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error('[Resend] Booking email exception:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
