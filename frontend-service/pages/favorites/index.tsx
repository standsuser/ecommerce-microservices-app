import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@nextui-org/react';
import DefaultLayout from '@/layouts/default';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Favorites = () => {
  const [favoritesItems, setFavoritesItems] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user');
    setUserId(storedUserId);
    if (storedUserId) {
      fetchFavoritesItems(storedUserId);
    }
  }, []);

  const fetchFavoritesItems = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/product/favorites/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorites items');
      }
      const data = await response.json();
      setFavoritesItems(data);
      // Fetch product details for each favorite item
      fetchProductDetails(data);
    } catch (error) {
      console.error('Error fetching favorites items:', error);
      toast.error('Error fetching favorites items');
    }
  };

  const fetchProductDetails = async (favoritesItems: any[]) => {
    try {
      const productIds = favoritesItems.map(item => item.productid);
      const responses = await Promise.all(
        productIds.map(productId =>
          fetch(`http://localhost:3000/product/${productId}`)
        )
      );
      const productsData = await Promise.all(responses.map(res => res.json()));
      const updatedFavoritesItems = favoritesItems.map((item, index) => ({
        ...item,
        productDetails: productsData[index],
      }));
      setFavoritesItems(updatedFavoritesItems);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Error fetching product details');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/product/${userId}/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from favorites');
      }
      setFavoritesItems(favoritesItems.filter(item => item.productid !== productId));
      toast.success('Item removed from favorites successfully');
    } catch (error) {
      console.error('Failed to remove item from favorites:', error);
      toast.error('Failed to remove item from favorites');
    }
  };

  const handleAddToCart = async (productId: string, item: any) => {
    try {
      const payload = {
        quantity: 1,
        rentalDuration: "",
        name: item.productDetails.name,
        amount_cents: item.productDetails.totalPrice * 100, // multiply totalPrice by 100
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

      toast.success('Item added to cart successfully');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <DefaultLayout>
      <ToastContainer />
      <div style={{ maxWidth: '800px', margin: '10px auto', padding: '20px', border: '1px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#fff', textAlign: 'center' }}>Your Favorites</h1>
        <div>
          {favoritesItems.map(item => (
            <div
              key={item._id}
              style={{
                border: '1px solid #555',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                backgroundColor: '#222',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div>
                {item.productDetails?.imageURL && (
                  <img
                    src={item.productDetails.imageURL}
                    alt={item.productDetails.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'contain',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                )}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>{item.productDetails?.name}</h2>
              <p style={{ marginBottom: '8px', color: '#bbb', textAlign: 'center' }}>{item.productDetails?.description}</p>
              <p style={{ fontSize: '16px', marginBottom: '12px', color: '#fff', textAlign: 'center' }}>Price: ${(item.productDetails?.totalPrice)}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                <Button
                  color="primary"
                  style={{
                    margin: '4px',
                    backgroundColor: '#6b5b95',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease, transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#574375';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b5b95';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleAddToCart(item.productid, item)}
                >
                  Add to Cart
                </Button>
                <Button
                  color="danger"
                  style={{
                    margin: '4px',
                    backgroundColor: '#FFA500',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease, transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#cc8400';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFA500';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleRemoveItem(item.productid)}
                >
                  Remove from Favorites
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Favorites;