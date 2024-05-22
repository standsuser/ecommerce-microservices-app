const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCartItems = async (sessionId: string) => {
  const response = await fetch(`${API_URL}/cart/guest/${sessionId}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }
  return response.json();
};

export const addItemToCart = async (sessionId: string, productId: string, addItemDto: any) => {
  const response = await fetch(`${API_URL}/cart/guest/${sessionId}/add-item/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addItemDto),
  });
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  return response.json();
};

export const removeItemFromCart = async (sessionId: string, productId: string) => {
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

export const createOrder = async (userId: string, shipping_data: string) => {
  const response = await fetch(`${API_URL}/cart/${userId}/createOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shipping_data: shipping_data }),
  });
  if (!response.ok) {
    throw new Error('Failed to register order');
  }
  return response.json();
};

export const updateItemQuantity = async (sessionId: string, productId: string, quantityChange: number) => {
  const response = await fetch(`${API_URL}/cart/guest/${sessionId}/update-quantity/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: quantityChange }),
  });
  if (!response.ok) {
    throw new Error('Failed to update item quantity');
  }
  return response.json();
};