import { Resend } from 'resend';

/** Mirrors storefront globals.css brand tokens */
const BRAND = {
  primary: '#e33a90',
  primaryDark: '#cc1f7a',
  accent: '#fdf2f8',
  accentBorder: '#fce7f3',
  canvas: '#ffffff',
  textPrimary: '#1a1a1a',
  textBody: '#4b5563',
  muted: '#6b7280',
} as const;

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM = process.env.RESEND_FROM_EMAIL?.trim() || 'Anashe <onboarding@resend.dev>';

const FONT_UI = `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const FONT_DISPLAY = `'Montserrat Alternates', Georgia, 'Times New Roman', serif`;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function baseTemplate(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anashe</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@500;600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${BRAND.accent};font-family:${FONT_UI};color:${BRAND.textBody};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,${BRAND.accent} 0%,#ffffff 55%);padding:36px 16px 48px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.canvas};border-radius:20px;border:1px solid ${BRAND.accentBorder};overflow:hidden;box-shadow:0 24px 48px -24px rgba(227,58,144,0.22),0 8px 24px -12px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:${BRAND.accent};padding:26px 28px;border-bottom:1px solid ${BRAND.accentBorder};">
              <p style="margin:0;font-family:${FONT_DISPLAY};font-size:26px;font-weight:700;color:${BRAND.primary};letter-spacing:-0.03em;line-height:1.15;">Anashe</p>
              <p style="margin:8px 0 0;font-size:11px;font-weight:600;color:${BRAND.primaryDark};letter-spacing:0.14em;text-transform:uppercase;opacity:0.85;">Beauty Essentials</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 26px 32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:22px 26px;background:${BRAND.accent};border-top:1px solid ${BRAND.accentBorder};">
              <p style="margin:0;font-size:12px;color:${BRAND.muted};text-align:center;line-height:1.65;">
                Anashe Cosmetics · Nairobi, Kenya<br />
                <a href="https://siscom.africa" style="color:${BRAND.primary};font-weight:600;text-decoration:none;">siscom.africa</a>
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

/** Bordered card matching storefront rounded-xl + border-accent */
function card(inner: string, padding = '22px 20px') {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:${BRAND.canvas};border:1px solid ${BRAND.accentBorder};border-radius:16px;">
    <tr>
      <td style="padding:${padding};">${inner}</td>
    </tr>
  </table>`;
}

function pill(text: string) {
  return `<span style="display:inline-block;background:${BRAND.accent};color:${BRAND.primaryDark};border:1px solid ${BRAND.accentBorder};border-radius:999px;padding:6px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">${text}</span>`;
}

function lineItem(label: string, value: string, bold = false) {
  return `<tr>
    <td style="padding:10px 0;font-size:14px;color:${BRAND.textBody};vertical-align:top;">${label}</td>
    <td style="padding:10px 0;font-size:14px;text-align:right;vertical-align:top;${bold ? `font-weight:700;font-size:17px;color:${BRAND.textPrimary};font-family:${FONT_DISPLAY};` : `color:${BRAND.textPrimary};`}">${value}</td>
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

  const customer = escapeHtml(params.customerName?.trim() || 'there');
  const totalFormatted = `KES ${Number(params.total).toLocaleString('en-KE')}`;

  const itemsRows =
    params.items && params.items.length > 0
      ? params.items
          .map(
            (item) => `<tr>
              <td style="padding:14px 0;font-size:14px;color:${BRAND.textPrimary};border-bottom:1px solid ${BRAND.accentBorder};line-height:1.45;">
                <span style="font-weight:500;">${escapeHtml(item.product_name)}</span>
                <span style="display:block;margin-top:4px;font-size:12px;color:${BRAND.muted};">Qty ${item.quantity}</span>
              </td>
              <td style="padding:14px 0;font-size:14px;font-weight:600;text-align:right;color:${BRAND.textPrimary};border-bottom:1px solid ${BRAND.accentBorder};vertical-align:top;">
                KES ${(item.unit_price * item.quantity).toLocaleString('en-KE')}
              </td>
            </tr>`
          )
          .join('')
      : '';

  const itemsCard =
    params.items && params.items.length > 0
      ? card(
          `<p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.muted};">Items</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemsRows}</table>`,
          '18px 18px 16px'
        )
      : '';

  const referenceCard = card(
    `<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.muted};">Order reference</p>
    <p style="margin:0;font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;color:${BRAND.textPrimary};letter-spacing:0.02em;">${escapeHtml(params.orderNumber)}</p>`,
    '22px 20px'
  );

  const totalCard = card(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${lineItem('Total', totalFormatted, true)}
    </table>`,
    '18px 20px'
  );

  const noticeCard = card(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:44px;vertical-align:top;padding-right:14px;">
          <div style="width:36px;height:36px;border-radius:12px;background:${BRAND.accent};border:1px solid ${BRAND.accentBorder};text-align:center;line-height:34px;font-size:18px;">✓</div>
        </td>
        <td style="vertical-align:top;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:${BRAND.primaryDark};font-family:${FONT_DISPLAY};">Next steps</p>
          <p style="margin:0;font-size:14px;color:${BRAND.textBody};line-height:1.65;">
            Complete your M-Pesa payment if you have not already. We will confirm your payment once verified, then prepare and ship your order. We will notify you when it is on its way.
          </p>
        </td>
      </tr>
    </table>`,
    '20px 20px'
  );

  const body = `
    <p style="margin:0 0 12px;">${pill('Order placed')}</p>
    <h2 style="margin:0 0 12px;font-family:${FONT_DISPLAY};font-size:26px;font-weight:700;color:${BRAND.textPrimary};letter-spacing:-0.02em;line-height:1.2;">Thank you, ${customer}</h2>
    <p style="margin:0 0 26px;font-size:15px;color:${BRAND.textBody};line-height:1.65;">
      Your order is in. Here is a summary that matches what you see in your account.
    </p>

    ${referenceCard}
    ${itemsCard}
    ${totalCard}
    ${noticeCard}

    <p style="margin:8px 0 0;font-size:14px;color:${BRAND.textBody};line-height:1.65;">
      Questions? Reply to this email or write to
      <a href="mailto:hello@siscom.africa" style="color:${BRAND.primary};font-weight:600;text-decoration:none;">hello@siscom.africa</a>.
    </p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Order ${params.orderNumber} placed — Anashe`,
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

  const detailsCard = card(
    `<p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.muted};">Appointment details</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${lineItem('Service', escapeHtml(params.serviceType))}
      ${lineItem('Date', escapeHtml(params.preferredDate))}
      ${lineItem('Time', escapeHtml(params.preferredTime))}
    </table>`,
    '22px 20px'
  );

  const noticeCard = card(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:middle;padding-right:14px;width:1%;">${pill('Pending')}</td>
        <td style="vertical-align:middle;">
          <p style="margin:0;font-size:14px;color:${BRAND.textBody};line-height:1.65;">
            We will confirm your appointment within <strong style="color:${BRAND.textPrimary};">24 hours</strong>.
          </p>
        </td>
      </tr>
    </table>`,
    '18px 20px'
  );

  const body = `
    <p style="margin:0 0 12px;">${pill('Booking')}</p>
    <h2 style="margin:0 0 12px;font-family:${FONT_DISPLAY};font-size:26px;font-weight:700;color:${BRAND.textPrimary};letter-spacing:-0.02em;line-height:1.2;">Request received</h2>
    <p style="margin:0 0 26px;font-size:15px;color:${BRAND.textBody};line-height:1.65;">
      Hi ${escapeHtml(params.customerName)}, thanks for reaching out to Anashe. Here are the details we saved.
    </p>

    ${detailsCard}
    ${noticeCard}

    <p style="margin:8px 0 0;font-size:14px;color:${BRAND.textBody};line-height:1.65;">
      Need to reschedule or have questions? Contact us at
      <a href="mailto:hello@siscom.africa" style="color:${BRAND.primary};font-weight:600;text-decoration:none;">hello@siscom.africa</a>.
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
