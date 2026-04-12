export const ORDER_STORAGE_KEY = "anashe-last-order";

export function generateOrderId() {
  const part = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `AN-${part}${rand}`;
}
