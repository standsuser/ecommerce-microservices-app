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

export const registerOrder = async (userId: string, orderData: any) => {
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
  const hiddenResponse = await fetch(`http://localhost:3015/${userId}/createOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  return response.json();
};

export const getPaymentKeyAndRedirect = async (orderId: string, paymentData: any) => {
  const API_URL = 'http://localhost:3010';

  const response = await fetch(`${API_URL}/payment/order-payment/${orderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to get payment key and redirect');
  }


  return response.json();
};