const API_URL = 'http://localhost:3000';

export const getAllProducts = async () => {
    const response = await fetch(`${API_URL}/product/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return response.json();
};

export const getProductReviews = async (productId: string) => {
    const response = await fetch(`${API_URL}/product/review/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Failed to fetch product reviews');
    }

    return response.json();
};