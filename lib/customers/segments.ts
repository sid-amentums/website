export type Segment = 'vip' | 'repeat' | 'at_risk' | 'new'

const VIP_LIFETIME_SPEND_INR = 25000
const REPEAT_BUYER_ORDER_COUNT = 2
const AT_RISK_DAYS_SINCE_LAST_ORDER = 90

export function getCustomerSegments(input: {
  paidOrderCount: number
  totalSpentInr: number
  lastPaidOrderAt: string | null
}): Segment[] {
  const segments: Segment[] = []

  if (input.totalSpentInr >= VIP_LIFETIME_SPEND_INR) segments.push('vip')
  if (input.paidOrderCount >= REPEAT_BUYER_ORDER_COUNT) segments.push('repeat')

  if (input.paidOrderCount === 0) {
    segments.push('new')
  } else if (input.lastPaidOrderAt) {
    const daysSince = (Date.now() - new Date(input.lastPaidOrderAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > AT_RISK_DAYS_SINCE_LAST_ORDER) segments.push('at_risk')
  }

  return segments
}

export const SEGMENT_LABELS: Record<Segment, string> = {
  vip: 'VIP',
  repeat: 'Repeat Buyer',
  at_risk: 'At Risk',
  new: 'New',
}
