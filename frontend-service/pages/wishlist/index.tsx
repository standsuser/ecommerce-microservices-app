import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@nextui-org/react';

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
      console.log('Fetching product details for productIds:', productIds); // Log productIds being fetched
      const responses = await Promise.all(
        productIds.map(productId =>
          fetch(`http://localhost:3000/product/${productId}`)
        )
      );
      const productsData = await Promise.all(responses.map(res => res.json()));
      console.log('Received product details:', productsData); // Log received product details
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

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3015/cart/add-item/${userId}/${productId}`, {
        method: 'POST',
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
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>
      <div className="wishlist-items">
        {wishlistItems.map(item => (
          <div key={item._id} className="wishlist-item">
          <div>
            {item.productDetails?.imageURL && (
              <img src={item.productDetails.imageURL} alt={item.name} className="wishlist-item-image" />
            )}
          </div>
          <h2 className="wishlist-item-name">NAME: {item.productDetails?.name}</h2>
          <p className="wishlist-item-description">DESCRIPTION: {item.productDetails?.description}</p>
         
          <p className="wishlist-item-price">Price: ${(item.productDetails?.totalPrice)}</p>
        
          <div className="wishlist-item-actions">
            <Button color="primary" onClick={() => handleAddToCart(item.productid)}>
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
  );
};

export default Wishlist;
