export const parsePrice = (price: string) =>
  parseFloat(price.replace("₺", "").replace(/\s/g, "").replace(",", "."));

export const formatPrice = (value: number) => `${value.toFixed(2)} ₺`;
