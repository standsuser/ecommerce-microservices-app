import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Button, Progress, Card, Spacer, Select } from "@nextui-org/react";
import { getUserAddresses } from "@/pages/api/checkoutApi";

type CartItem = {
    id: string;
    productId: string;
    rentalDuration: string;
    isRented: boolean;
    name: string;
    amount_cents: number;
    description: string;
    color: string;
    size: string;
    material: string;
    quantity: number;
};

type Address = {
    _id: string;
    userid: string;
    addresslabel: string;
    apartment: string;
    email: string;
    floor: number;
    first_name: string;
    street: string;
    building: string;
    phone_number: string;
    postal_code: number;
    extra_description: string;
    city: string;
    country: string;
    last_name: string;
    state: string;
};

const CheckoutPage: React.FC = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [discountedTotal, setDiscountedTotal] = useState<string>('0.00');
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('');

    useEffect(() => {
        setUserId(localStorage.getItem('user'));
        setSessionId(localStorage.getItem('sessionId'));
      }, []);

    useEffect(() => {
        if (router.query.cartItems) {
            setCartItems(JSON.parse(router.query.cartItems as string));
        }
        if (router.query.discountedTotal) {
            setDiscountedTotal(router.query.discountedTotal as string);
        }

        const fetchAddresses = async () => {
            const userId = localStorage.getItem('user');
            if (userId) {
                try {
                    const addresses = await getUserAddresses(userId);
                    setAddresses(addresses);
                } catch (error) {
                    console.error('Failed to fetch addresses:', error);
                }
            }
        };
        // if (userId) {
        //     const items = await getCartItems(userId, true);
        //     setCartItems(items);
        //     calculateTotalPrice(items, getCouponDiscount());
        //   } else if (sessionId) {
        //     const items = await getCartItems(sessionId, false);
        //     setCartItems(items);
        //     calculateTotalPrice(items, getCouponDiscount());
        //   }
        fetchAddresses();
    }, [router.query.cartItems, router.query.discountedTotal]);

    const handleOrderSubmit = () => {
        // Add order submission logic here
        console.log("Order submitted with:", { cartItems, discountedTotal, selectedAddress });
        setOrderSubmitted(true);
    };

    const getTotalPrice = () => {
        return (
            cartItems.reduce((total, item) => total + item.amount_cents * item.quantity, 0) /
            100
        ).toFixed(2);
    };

    if (orderSubmitted) {
        return (
            <DefaultLayout>
                <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                    <Card style={{ maxWidth: "400px", padding: "20px" }}>
                        <h1 className={title()}>Thank You!</h1>
                        <p>Your order has been submitted successfully.</p>
                        <Spacer y={1} />
                        <Link href="/" className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}>
                            Return to Home
                        </Link>
                    </Card>
                </section>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center mt-20">
                    <h1 className={title()}>Checkout</h1>
                    <Progress value={50} color="primary" />
                </div>

                <div className="flex flex-col gap-4 mt-8 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    {cartItems.length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #ddd" }}>
                                    <th style={{ padding: "8px", textAlign: "left" }}>Item</th>
                                    <th style={{ padding: "8px", textAlign: "left" }}>Price</th>
                                    <th style={{ padding: "8px", textAlign: "left" }}>Quantity</th>
                                    <th style={{ padding: "8px", textAlign: "left" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td style={{ padding: "8px" }}>{item.name}</td>
                                        <td style={{ padding: "8px" }}>${(item.amount_cents / 100).toFixed(2)}</td>
                                        <td style={{ padding: "8px" }}>{item.quantity}</td>
                                        <td style={{ padding: "8px" }}>
                                            ${(item.amount_cents * item.quantity / 100).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right", padding: "8px" }}>Total</td>
                                    <td style={{ padding: "8px" }}>${getTotalPrice()}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right", padding: "8px" }}>Total after Coupon</td>
                                    <td style={{ padding: "8px" }}>${discountedTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}

                    <h2 className="text-xl font-semibold mt-8">Pick Address</h2>
                    <Select
                        placeholder="Select Address"
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        fullWidth
                    >
                        {addresses.map(address => (
                            <option key={address._id} value={address._id}>
                                {address.addresslabel}
                            </option>
                        ))}
                    </Select>

                    <Button
                        className={buttonStyles({
                            color: "primary",
                            radius: "full",
                            variant: "shadow",
                        })}
                        onClick={handleOrderSubmit}
                        style={{ marginTop: "20px" }}
                        disabled={!selectedAddress}
                    >
                        Submit Order
                    </Button>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default CheckoutPage;