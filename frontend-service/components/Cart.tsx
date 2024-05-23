import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSessionId } from '@/pages/_app'; // Adjust the import based on your directory structure
import { getCartItems, applyCoupon, updateItemQuantity, createOrder } from '@/pages/api/cartApi';
import { Button, Input } from '@nextui-org/react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null); // Replace with actual user ID retrieval logic
  const [shippingData, setShippingData] = useState<any>({
    apartment: '',
    email: '',
    floor: '',
    first_name: '',
    street: '',
    building: '',
    phone_number: '',
    postal_code: '',
    extra_description: '',
    city: '',
    country: '',
    last_name: '',
    state: '',
  });
  const router = useRouter();

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
      try {
        if (userId) {
          const items = await getCartItems(userId, true);
          setCartItems(items);
          calculateTotalPrice(items);
        } else if (sessionId) {
          const items = await getCartItems(sessionId, false);
          setCartItems(items);
          calculateTotalPrice(items);
        }
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId, sessionId]);

  const calculateTotalPrice = (items: any) => {
    const total = items.reduce((acc: number, item: any) => acc + (item.amount_cents * item.quantity), 0) / 100;
    setTotalPrice(total);
  };

  const handleAddItem = async (productId: string) => {
    if (sessionId) {
      const updatedCart = await updateItemQuantity(sessionId, productId, 1);
      setCartItems(updatedCart.items);
      calculateTotalPrice(updatedCart.items);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (sessionId) {
      const updatedCart = await updateItemQuantity(sessionId, productId, -1);
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

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert('User is not logged in');
      return;
    }
    try {
      const order = await createOrder(userId, shippingData);
      alert('Order placed successfully');
      // You can also navigate to a confirmation page or clear the cart
    } catch (error) {
      console.error('Failed to place order', error);
      alert('Failed to place order');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
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
        <p className="cart-total-price">Total Price: ${totalPrice.toFixed(2)}</p>
      </div>
      <div className="shipping-form">
        <h2>Shipping Information</h2>
        <Input
          name="first_name"
          placeholder="First Name"
          value={shippingData.first_name}
          onChange={handleChange}
        />
        <Input
          name="last_name"
          placeholder="Last Name"
          value={shippingData.last_name}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          value={shippingData.email}
          onChange={handleChange}
        />
        <Input
          name="phone_number"
          placeholder="Phone Number"
          value={shippingData.phone_number}
          onChange={handleChange}
        />
        <Input
          name="street"
          placeholder="Street"
          value={shippingData.street}
          onChange={handleChange}
        />
        <Input
          name="building"
          placeholder="Building"
          value={shippingData.building}
          onChange={handleChange}
        />
        <Input
          name="apartment"
          placeholder="Apartment"
          value={shippingData.apartment}
          onChange={handleChange}
        />
        <Input
          name="floor"
          placeholder="Floor"
          value={shippingData.floor}
          onChange={handleChange}
        />
        <Input
          name="city"
          placeholder="City"
          value={shippingData.city}
          onChange={handleChange}
        />
        <Input
          name="state"
          placeholder="State"
          value={shippingData.state}
          onChange={handleChange}
        />
        <Input
          name="postal_code"
          placeholder="Postal Code"
          value={shippingData.postal_code}
          onChange={handleChange}
        />
        <Input
          name="country"
          placeholder="Country"
          value={shippingData.country}
          onChange={handleChange}
        />
        <Input
          name="extra_description"
          placeholder="Extra Description"
          value={shippingData.extra_description}
          onChange={handleChange}
        />
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