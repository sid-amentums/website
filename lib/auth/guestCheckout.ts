export const GUEST_CHECKOUT_FLAG = 'amentum_guest_checkout'

export function isGuestCheckoutFlagSet(): boolean {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(GUEST_CHECKOUT_FLAG) === '1'
}
