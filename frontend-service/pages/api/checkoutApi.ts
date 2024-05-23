const PROFILE_API_URL = 'http://localhost:3003'; // Ensure this matches your backend URL

export const getUserAddresses = async (userId: string) => {
  const response = await fetch(`${PROFILE_API_URL}/user/address/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user addresses');
  }

  return response.json();
};
const PAYMENT_API_URL = 'http://localhost:3010';

export const registerOrder = async (orderData: any) => {
  const response = await fetch(`${PAYMENT_API_URL}/payment/register-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Failed to register order');
  }

  return response.json();
};