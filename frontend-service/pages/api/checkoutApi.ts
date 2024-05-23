const PROFILE_API_URL = 'http://localhost:3003';

export const getUserAddresses = async (userId: string) => {
  const response = await fetch(`${PROFILE_API_URL}/user/address/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user addresses');
  }

  return response.json();
};