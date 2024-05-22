import { useEffect, useState } from 'react';
import { getSessionId } from '@/pages/_app'; // Adjust the import based on your directory structure
import { addItemToCart, getCartItems, removeItemFromCart } from '@/pages/api/cartApi';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionId = () => {
      try {
        const id = getSessionId();
        setSessionId(id);
      } catch (error) {
        console.error('Error accessing localStorage', error);
      }
    };

    fetchSessionId();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (sessionId) {
        const items = await getCartItems(sessionId);
        setCartItems(items);
      }
    };

    fetchCartItems();
  }, [sessionId]);

  const handleAddItem = async (productId: string, quantity: number) => {
    if (sessionId) {
      const addItemDto = { quantity };
      const updatedCart = await addItemToCart(sessionId, productId, addItemDto);
      setCartItems(updatedCart.items);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (sessionId) {
      const updatedCart = await removeItemFromCart(sessionId, productId);
      setCartItems(updatedCart.items);
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cartItems.map((item: any) => (
          <li key={item.productId}>
            {item.productName} - {item.quantity}
            <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* Add more UI elements as needed, e.g., total price, checkout button, etc. */}
    </div>
  );
};

export default Cart;