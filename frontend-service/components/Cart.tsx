import { useEffect, useState } from 'react';
import { getSessionId } from '@/pages/_app'; // Adjust the import based on your directory structure
import { addOneItem, removeOneItem, getCartItems, applyCoupon } from '@/pages/api/cartApi';
import { Button, Input } from '@nextui-org/react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

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
        calculateTotalPrice(items);
      }
    };

    fetchCartItems();
  }, [sessionId]);

  const calculateTotalPrice = (items: any) => {
    const total = items.reduce((acc: number, item: any) => acc + (item.amount_cents * item.quantity), 0) / 100;
    setTotalPrice(total);
  };

  const handleAddOneItem = async (productId: string) => {
    if (sessionId) {
      const updatedCart = await addOneItem(sessionId, productId);
      setCartItems(updatedCart.items);
      calculateTotalPrice(updatedCart.items);
    }
  };

  const handleRemoveOneItem = async (productId: string) => {
    if (sessionId) {
      const updatedCart = await removeOneItem(sessionId, productId);
      setCartItems(updatedCart.items);
      calculateTotalPrice(updatedCart.items);
    }
  };

  const handleApplyCoupon = async () => {
    if (sessionId && couponCode) {
      const updatedCart = await applyCoupon(sessionId, couponCode);
      setCartItems(updatedCart.items);
      calculateTotalPrice(updatedCart.items);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-items">
        {cartItems.map((item: any) => (
          <div key={item.productId} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            <h2 className="cart-item-name">{item.name}</h2>
            <p className="cart-item-description">{item.description}</p>
            <p className="cart-item-details">Color: {item.color}</p>
            <p className="cart-item-details">Size: {item.size}</p>
            <p className="cart-item-details">Material: {item.material}</p>
            <p className="cart-item-quantity">Quantity: {item.quantity}</p>
            <p className="cart-item-price">Price: ${(item.amount_cents / 100).toFixed(2)}</p>
            <div className="cart-item-actions">
              <Button color="primary" onClick={() => handleAddOneItem(item.productId)}>
                Add One
              </Button>
              <Button auto color="error" onClick={() => handleRemoveOneItem(item.productId)}>
                Remove One
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-coupon">
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Enter Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button color="primary" onClick={handleApplyCoupon}>
          Apply
        </Button>
        <p className="cart-total-price">Total Price: ${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Cart;
