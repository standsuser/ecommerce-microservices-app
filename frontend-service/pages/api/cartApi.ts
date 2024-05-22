const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCartItems = async (sessionId: string) => {
  const response = await fetch(`${API_URL}/cart/guest/${sessionId}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }
  return response.json();
};

export const addOneItem = async (sessionId: string, productId: string) => {
  const response = await fetch(`${API_URL}/cart/guest/${sessionId}/add-item/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: 1, amount_cents: 1000 }), // Adjust the amount_cents based on your product data
  });
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  return response.json();
};

export const removeOneItem = async (sessionId: string, productId: string) => {
  const response = await fetch(`${API_URL}/cart/guest/${sessionId}/remove-item/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
  return response.json();
};

export const applyCoupon = async (sessionId: string, couponCode: string) => {
  const response = await fetch(`${API_URL}/cart/apply-coupon/${sessionId}/${couponCode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to apply coupon');
  }
  return response.json();
};