import { getMpesaToken, getMpesaTimestamp, getMpesaPassword, MPESA_BASE_URL } from './auth';
import { formatPhone } from '../utils';
import type { STKPushResponse } from '@/types';

interface STKPushParams {
  phone: string;
  amount: number;
  orderId: string;
  callbackUrl?: string;
}

export async function initiateSTKPush({ phone, amount, orderId, callbackUrl }: STKPushParams): Promise<STKPushResponse> {
  const token = await getMpesaToken();
  const timestamp = getMpesaTimestamp();
  const password = getMpesaPassword(timestamp);
  const shortcode = process.env.MPESA_SHORTCODE!;
  const formattedPhone = formatPhone(phone);
  const cbUrl = callbackUrl ?? process.env.MPESA_CALLBACK_URL!;

  const body = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: cbUrl,
    AccountReference: `ANASHE-${orderId.substring(0, 8).toUpperCase()}`,
    TransactionDesc: 'Anashe Order Payment',
  };

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`STK Push failed: ${error}`);
  }

  const payload = await res.json() as STKPushResponse;
  if (payload.ResponseCode !== '0') {
    throw new Error(payload.CustomerMessage || payload.ResponseDescription || 'STK push was rejected');
  }

  return payload;
}
