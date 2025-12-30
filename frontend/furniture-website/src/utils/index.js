import { currencySymbols, exchangeRates } from '@config';

export const rebounce = (fn, delay = 300) => {
  let timeoutId;

  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };

  return debounced;
};

export const slugify = (title) => {
  if (!title) return;
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\s\_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatNumber = (num, locale = 'en') => Number(num).toLocaleString(locale);

export const convertPrice = (price, currency = 'PKR') => {
  const rate = exchangeRates[currency] || 1;

  if (Array.isArray(price)) {
    return [price[0] * rate, price[1] * rate];
  }

  return price * rate;
};

export const formatPrice = (price, currency = 'PKR') => {
  const symbol = currencySymbols[currency] || currency;

  const converted = convertPrice(price, currency);

  if (Array.isArray(converted)) {
    return `${symbol} ${formatNumber(converted[0])} - ${formatNumber(converted[1])}`;
  }

  return `${symbol} ${formatNumber(converted)}`;
};

export * from './localStorage';
