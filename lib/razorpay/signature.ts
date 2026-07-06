import crypto from 'crypto'

// Recomputes the Razorpay order signature and compares with a constant-time
// check. This is the entire trust boundary for "was this order actually
// paid" — the client-side checkout.js `handler` callback firing proves
// nothing on its own.
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const expectedBuf = Buffer.from(expected)
  const signatureBuf = Buffer.from(signature)
  if (expectedBuf.length !== signatureBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, signatureBuf)
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')

  const expectedBuf = Buffer.from(expected)
  const signatureBuf = Buffer.from(signature)
  if (expectedBuf.length !== signatureBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, signatureBuf)
}
