import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('M-Pesa Callback Received:', JSON.stringify(data, null, 2));

    const result = data.Body.stkCallback;
    if (result.ResultCode === 0) {
      // Payment successful
      // Here you would typically update the order status in your database
      console.log('Payment Successful for CheckoutRequestID:', result.CheckoutRequestID);
    } else {
      // Payment failed or cancelled
      console.log('Payment Failed:', result.ResultDesc);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error('M-Pesa Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}
