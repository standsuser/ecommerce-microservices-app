const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addItemToCart = async (userId: string, productId: string, addItemDto: any) => {
  const response = await fetch(`http://locahost:3015/cart/${userId}/add-item/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addItemDto),
  });
  return response.json();
};

export const getCartItems = async (sessionId: string) => {
  const response = await fetch(`${API_URL}/cart/guest/${sessionId}/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }
  return response.json();
};

export const removeItemFromCart = async (userId: string, productId: string) => {
  const response = await fetch(`http://locahost:3015/cart/remove-item/${userId}/${productId}`, {
    method: 'DELETE',
  });
  return response.json();
};