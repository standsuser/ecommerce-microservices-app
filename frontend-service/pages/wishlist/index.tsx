import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@nextui-org/react';
import DefaultLayout from '@/layouts/default';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user');
    setUserId(storedUserId);
    if (storedUserId) {
      fetchWishlistItems(storedUserId);
    }
  }, []);

  const fetchWishlistItems = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/user/mywishlist/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist items');
      }
      const data = await response.json();
      setWishlistItems(data);
      // Fetch product details for each wishlist item
      fetchProductDetails(data);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    }
  };

  const fetchProductDetails = async (wishlistItems: any[]) => {
    try {
      const productIds = wishlistItems.map(item => item.productid);
      const responses = await Promise.all(
        productIds.map(productId =>
          fetch(`http://localhost:3000/product/${productId}`)
        )
      );
      const productsData = await Promise.all(responses.map(res => res.json()));
      const updatedWishlistItems = wishlistItems.map((item, index) => ({
        ...item,
        productDetails: productsData[index],
      }));
      setWishlistItems(updatedWishlistItems);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleRemoveItem = async (wishlistId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/user/deleteWishlistItem/${userId}?wishlistId=${wishlistId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }
      setWishlistItems(wishlistItems.filter(item => item._id !== wishlistId));
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId: string, item: any) => {
    try {
      const payload = {
        quantity: 1,
        rentalDuration: "",
        name: item.productDetails.name,
        amount_cents: item.productDetails.totalPrice, // assuming totalPrice is in dollars
        description: item.productDetails.description,
        color: "red",
        size: "medium",
        material: "plastic"
      };
  
      const response = await fetch(`http://localhost:3015/cart/${userId}/add-item/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
  
      alert('Item added to cart successfully');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  return (
    <DefaultLayout>

    <div style={{ maxWidth: '800px', margin: '10px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'purple' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Your Wishlist</h1>
      <div>
        {wishlistItems.map(item => (
          <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '12px', backgroundColor: 'black' }}>
            <div>
              {item.productDetails?.imageURL && (
                <img src={item.productDetails.imageURL} alt={item.productDetails.name} style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '12px' }} />
              )}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.productDetails?.name}</h2>
            <p style={{ marginBottom: '8px' }}>{item.productDetails?.description}</p>
            <p style={{ fontSize: '16px', marginBottom: '12px' }}>Price: ${(item.productDetails?.totalPrice)}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button color="primary" onClick={() => handleAddToCart(item.productid, item)}>
                Add to Cart
              </Button>
              <Button color="primary" onClick={() => handleRemoveItem(item._id)}>
                Remove from Wishlist
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </DefaultLayout>

  );
};

export default Wishlist;
