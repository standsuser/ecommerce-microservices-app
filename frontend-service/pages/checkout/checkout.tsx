import React, { useState } from "react";
import { useRouter } from 'next/router';
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Input, Button, Progress, Card, Spacer } from "@nextui-org/react";

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

const CheckoutPage: React.FC = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: "1",
            productId: "product1",
            rentalDuration: "1 week",
            isRented: false,
            name: "Item 1",
            amount_cents: 1000,
            description: "Description for Item 1",
            color: "Red",
            size: "M",
            material: "Cotton",
            quantity: 1,
        },
        {
            id: "2",
            productId: "product2",
            rentalDuration: "2 weeks",
            isRented: false,
            name: "Item 2",
            amount_cents: 2000,
            description: "Description for Item 2",
            color: "Blue",
            size: "L",
            material: "Polyester",
            quantity: 2,
        },
        // Add more items as needed
    ]);

    const [shippingInfo, setShippingInfo] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setInfo: React.Dispatch<React.SetStateAction<any>>
    ) => {
        const { name, value } = e.target;
        setInfo((prevInfo: any) => ({ ...prevInfo, [name]: value }));
    };

    const handleOrderSubmit = () => {
        // Add order submission logic here
        console.log("Order submitted with:", { cartItems, shippingInfo, paymentInfo, paymentMethod });
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
                            </tfoot>
                        </table>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}

                    <h2 className="text-xl font-semibold mt-8">Shipping Information</h2>
                    <form className="flex flex-col gap-4 mt-4">
                        <Input
                            fullWidth
                            isClearable
                            label="Name"
                            placeholder="John Doe"
                            name="name"
                            value={shippingInfo.name}
                            onChange={(e) => handleInputChange(e, setShippingInfo)}
                        />
                        <Input
                            fullWidth
                            isClearable
                            label="Address"
                            placeholder="123 Main St"
                            name="address"
                            value={shippingInfo.address}
                            onChange={(e) => handleInputChange(e, setShippingInfo)}
                        />
                        <Input
                            fullWidth
                            isClearable
                            label="City"
                            placeholder="Anytown"
                            name="city"
                            value={shippingInfo.city}
                            onChange={(e) => handleInputChange(e, setShippingInfo)}
                        />
                        <Input
                            fullWidth
                            isClearable
                            label="State"
                            placeholder="CA"
                            name="state"
                            value={shippingInfo.state}
                            onChange={(e) => handleInputChange(e, setShippingInfo)}
                        />
                        <Input
                            fullWidth
                            isClearable
                            label="ZIP Code"
                            placeholder="12345"
                            name="zip"
                            value={shippingInfo.zip}
                            onChange={(e) => handleInputChange(e, setShippingInfo)}
                        />
                    </form>

                    <h2 className="text-xl font-semibold mt-8">Payment Information</h2>
                    <form className="flex flex-col gap-4 mt-4">
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                />
                                Credit/Debit Card
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={() => setPaymentMethod("cash")}
                                />
                                Cash on Delivery
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="fawry"
                                    checked={paymentMethod === "fawry"}
                                    onChange={() => setPaymentMethod("fawry")}
                                />
                                Fawry
                            </label>
                        </div>

                        {paymentMethod === "card" && (
                            <>
                                <Input
                                    fullWidth
                                    isClearable
                                    label="Card Number"
                                    placeholder="1234 5678 9012 3456"
                                    name="cardNumber"
                                    value={paymentInfo.cardNumber}
                                    onChange={(e) => handleInputChange(e, setPaymentInfo)}
                                />
                                <Input
                                    fullWidth
                                    isClearable
                                    label="Expiry Date"
                                    placeholder="MM/YY"
                                    name="expiryDate"
                                    value={paymentInfo.expiryDate}
                                    onChange={(e) => handleInputChange(e, setPaymentInfo)}
                                />
                                <Input
                                    fullWidth
                                    isClearable
                                    label="CVV"
                                    placeholder="123"
                                    name="cvv"
                                    value={paymentInfo.cvv}
                                    onChange={(e) => handleInputChange(e, setPaymentInfo)}
                                />
                            </>
                        )}
                    </form>

                    <Button
                        className={buttonStyles({
                            color: "primary",
                            radius: "full",
                            variant: "shadow",
                        })}
                        onClick={handleOrderSubmit}
                        style={{ marginTop: "20px" }}
                    >
                        Submit Order
                    </Button>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default CheckoutPage;