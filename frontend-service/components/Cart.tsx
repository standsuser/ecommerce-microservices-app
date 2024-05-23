import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCartItems, updateItemQuantity, createOrder, applyCouponCode, removeCartItem } from '@/pages/api/cartApi';
import { Button, Input } from '@nextui-org/react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discountedTotal, setDiscountedTotal] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUserId(localStorage.getItem('user'));
    setSessionId(localStorage.getItem('sessionId'));
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (userId) {
          const items = await getCartItems(userId, true);
          setCartItems(items);
          calculateTotalPrice(items, getCouponDiscount());
        } else if (sessionId) {
          const items = await getCartItems(sessionId, false);
          setCartItems(items);
          calculateTotalPrice(items, getCouponDiscount());
        }
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    if (userId !== null || sessionId !== null) {
      fetchCartItems();
    }
  }, [userId, sessionId]);

  const calculateTotalPrice = (items: any, discountPercentage: number) => {
    const total = items.reduce((acc: number, item: any) => acc + (item.amount_cents * item.quantity), 0) / 100;
    setTotalPrice(total);
    const discounted = total - (total * (discountPercentage / 100));
    setDiscountedTotal(discounted);
  };

  const handleAddItem = async (productId: string) => {
    try {
      if (userId) {
        const updatedCart = await updateItemQuantity(userId, true, productId, 1);
        setCartItems(updatedCart.items);
        calculateTotalPrice(updatedCart.items, getCouponDiscount());
      } else if (sessionId) {
        const updatedCart = await updateItemQuantity(sessionId, false, productId, 1);
        setCartItems(updatedCart.items);
        calculateTotalPrice(updatedCart.items, getCouponDiscount());
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      if (userId) {
        const updatedCart = await removeCartItem(userId, true, productId);
        setCartItems(updatedCart.items);
        calculateTotalPrice(updatedCart.items, getCouponDiscount());
      } else if (sessionId) {
        const updatedCart = await removeCartItem(sessionId, false, productId);
        setCartItems(updatedCart.items);
        calculateTotalPrice(updatedCart.items, getCouponDiscount());
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const getCouponDiscount = () => {
    if (couponCode.length >= 2) {
      const discountPercentage = parseInt(couponCode.slice(-2), 10);
      return isNaN(discountPercentage) ? 0 : discountPercentage;
    }
    return 0;
  };

  const handleApplyCoupon = async () => {
    try {
      if (userId) {
        await applyCouponCode(userId, couponCode);
        const discountPercentage = getCouponDiscount();
        calculateTotalPrice(cartItems, discountPercentage);
        setCouponError(null);
      } else {
        setCouponError('You need to be logged in to apply a coupon');
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      setCouponError('Failed to apply coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert('User is not logged in');
      return;
    }
    try {
      const order = await createOrder(userId, {});
      alert('Order placed successfully');
      // You can also navigate to a confirmation page or clear the cart
    } catch (error) {
      console.error('Failed to place order', error);
      alert('Failed to place order');
    }
  };

  const handleSignUp = () => {
    if (sessionId) {
      router.push(`/register?sessionId=${sessionId}`);
    } else {
      alert('Session ID is missing');
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
              <Button color="primary" onClick={() => handleAddItem(item.productId)}>
                Add One
              </Button>
              <Button color="primary" onClick={() => handleRemoveItem(item.productId)}>
                Remove One
              </Button>
              <Button color="primary" onClick={() => handleRemoveItem(item.productId)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-coupon">
        <Input
          isClearable
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
        {couponError && <p style={{ color: 'red' }}>{couponError}</p>}
        <p className="cart-total-price">Total Price: ${totalPrice.toFixed(2)}</p>
        <p className="cart-total-price">Total after Coupon: ${discountedTotal.toFixed(2)}</p>
      </div>
      <Button color="success" onClick={handlePlaceOrder}>
        Place Order
      </Button>
      <Button color="primary" onClick={handleSignUp} className="mt-4">
        Sign Up
      </Button>
    </div>
  );
};

export default Cart;