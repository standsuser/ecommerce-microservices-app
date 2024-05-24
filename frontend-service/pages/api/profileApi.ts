const PROFILE_API_URL = 'http://localhost:3003';
const AUTH_API_URL = 'http://localhost:3080';



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
