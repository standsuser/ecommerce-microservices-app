const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCartItems = async (identifier: string, isUser: boolean) => {
  let url = isUser 
    ? `${API_URL}/cart/items/${identifier}` 
    : `${API_URL}/cart/guest/${identifier}/items`;

  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    // If user cart is not found, try fetching guest cart
    if (isUser && response.status === 404) {
      url = `${API_URL}/cart/guest/${identifier}/items`;
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    }

    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }
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

export const createOrder = async (userId: string, shippingData: any) => {
  const response = await fetch(`${API_URL}/cart/${userId}/createOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shipping_data: shippingData }),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
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