export * from './api/products';
export * from './api/collections';
export * from './api/orders';
export * from './api/auth';
export * from './api/cart';

export const simulateDelay = (promise, delay = 500) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      promise.then(resolve).catch(reject);
    }, delay);
  });
