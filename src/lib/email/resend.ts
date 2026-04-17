import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName?: string | null;
  orderNumber: string;
  total: number;
  receipt?: string | null;
}) {
  if (!resend) return;

  const customer = params.customerName?.trim() || 'there';
  const receiptLine = params.receipt ? `<p><strong>Payment Receipt:</strong> ${params.receipt}</p>` : '';

  await resend.emails.send({
    from: 'Anashe <hello@siscom.africa>',
    to: params.to,
    subject: 'Your beauty essentials are on their way',
    html: `
      <div style="font-family: Inter, Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2 style="margin-bottom: 8px;">Hi ${customer},</h2>
        <p>Thanks for shopping with Anashe. Your order has been confirmed.</p>
        <p><strong>Order Number:</strong> ${params.orderNumber}</p>
        <p><strong>Total Paid:</strong> KES ${Number(params.total).toLocaleString('en-KE')}</p>
        ${receiptLine}
        <p>Your beauty essentials are on their way.</p>
      </div>
    `,
  });
}

