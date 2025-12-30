export const loadCart = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart) return JSON.parse(serializedCart);
    return {};
  } catch (err) {
    return {};
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (err) {
    return;
  }
};
