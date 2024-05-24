const PROFILE_API_URL = 'http://localhost:3003';
const AUTH_API_URL = 'http://localhost:3080';
const CART_API_URL = 'http://localhost:3015'



export const getUserProfile = async (userId: string) => {
  const url = `${AUTH_API_URL}/${userId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const getPrevOrders = async (userId: string) => {
  const url = `${CART_API_URL}/${userId}/orders`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch previous orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch previous orders', error);
    throw error;
  }
};
