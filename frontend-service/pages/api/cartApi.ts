const API_URL = 'http://localhost:3015';

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


export const addItemToCart = async (identifier: string, productId: string, addItemDto: any, isUser: boolean) => {
  const url = isUser
    ? `${API_URL}/cart/${identifier}/add-item/${productId}`
    : `${API_URL}/cart/guest/${identifier}/add-item/${productId}`;

  const response = await fetch(url, {
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

export const applyCouponCode = async (userId: string, couponCode: string) => {
  const response = await fetch(`${API_URL}/cart/apply-coupon/${userId}/${couponCode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to apply coupon code');
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
  const hiddenResponse = await fetch(`${API_URL}/cart/${userId}/createOrder`, {
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

export const removeCartItem = async (identifier: string, isUser: boolean, productId: string) => {
  const url = isUser
    ? `${API_URL}/cart/remove-item/${identifier}/${productId}`
    : `${API_URL}/cart/guest/${identifier}/remove-item/${productId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }

  return response.json();
};

export const updateItemQuantity = async (identifier: string, isUser: boolean, productId: string, quantityChange: number) => {
  let url = isUser
    ? `${API_URL}/cart/${identifier}/update-quantity/${productId}`
    : `${API_URL}/cart/guest/${identifier}/update-quantity/${productId}`;

  let response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: quantityChange }),
    credentials: 'include',
  });

  if (!response.ok) {
    // If user cart is not found, try updating guest cart
    if (isUser && response.status === 404) {
      url = `${API_URL}/cart/guest/${identifier}/update-quantity/${productId}`;
      response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: quantityChange }),
        credentials: 'include',
      });
    }

    if (!response.ok) {
      throw new Error('Failed to update item quantity');
    }
  }

  return response.json();
};