const PROFILE_API_URL = 'http://localhost:3003';
const AUTH_API_URL = 'http://localhost:3080';
const CART_API_URL = 'http://localhost:3015'
const PRODUCT_API_URL = 'http://localhost:3000';



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
  const url = `${CART_API_URL}/cart/${userId}/orders`;
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
export const getAddress = async (userId: string) => {
  const url = `${PROFILE_API_URL}/user/address/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch address', error);
    throw error;
  }
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const url = `${PROFILE_API_URL}/user/deleteAddress/${userId}?addressId=${addressId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete address');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to delete address', error);
    throw error;
  }
};

export const addAddress = async (userId: string, address: any) => {
  const url = `${PROFILE_API_URL}/user/addAddress/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      throw new Error('Failed to add address');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add address', error);
    throw error;
  }
};
export const getCards = async (userId: string) => {
  const url = `${PROFILE_API_URL}/user/card/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cards', error);
    throw error;
  }
};

export const deleteCard = async (userId: string, cardId: string) => {
  const url = `${PROFILE_API_URL}/user/deleteCard/${userId}?cardId=${cardId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete card');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to delete card', error);
    throw error;
  }
};

export const getMyReviews = async (userId: string) => {
  const url = `${PRODUCT_API_URL}/product/myreviews/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch reviews', error);
    throw error;
  }
};

export const deleteMyReview = async (userId: string, reviewId: string) => {
  const url = `${PRODUCT_API_URL}/product/review/delete/${userId}/${reviewId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete review');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to delete review', error);
    throw error;
  }
};

export const updateMyReview = async (userId: string, reviewId: string, rating: number, review: string) => {
  const url = `${PRODUCT_API_URL}/product/review/update/${userId}/${reviewId}`;
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ rating, review }),
    });

    if (!response.ok) {
      throw new Error('Failed to update review');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update review', error);
    throw error;
  }
};