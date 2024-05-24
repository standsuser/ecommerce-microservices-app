import { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { getUserProfile, getPrevOrders, getAddress, deleteAddress, addAddress, getCards, deleteCard, getMyReviews, deleteMyReview, updateMyReview, addCard } from "@/pages/api/profileApi";

export default function PersonalInformationPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [cards, setCards] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState<any>({
        addresslabel: '',
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
        state: ''
    });
    const [newReview, setNewReview] = useState<any>({
        rating: 0,
        review: ''
    });
    const [newCard, setNewCard] = useState<any>({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: ''
    });

    useEffect(() => {
        const storedUserId = localStorage.getItem('user');
        const storedSessionId = localStorage.getItem('sessionId');
        setUserId(storedUserId);
        setSessionId(storedSessionId);

        if (storedUserId) {
            fetchUserData(storedUserId);
            fetchUserOrders(storedUserId);
            fetchUserAddresses(storedUserId);
            fetchUserCards(storedUserId);
            fetchUserReviews(storedUserId);
        }
    }, []);

    const fetchUserData = async (userId: string) => {
        try {
            const data = await getUserProfile(userId);
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const fetchUserOrders = async (userId: string) => {
        try {
            const orders = await getPrevOrders(userId);
            setOrders(orders);
        } catch (error) {
            console.error("Failed to fetch previous orders:", error);
        }
    };

    const fetchUserAddresses = async (userId: string) => {
        try {
            const addresses = await getAddress(userId);
            setAddresses(addresses);
        } catch (error) {
            console.error("Failed to fetch address:", error);
        }
    };

    const fetchUserCards = async (userId: string) => {
        try {
            const cards = await getCards(userId);
            setCards(cards);
        } catch (error) {
            console.error("Failed to fetch cards:", error);
        }
    };

    const fetchUserReviews = async (userId: string) => {
        try {
            const reviews = await getMyReviews(userId);
            setReviews(reviews);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!userId) return;
        try {
            await deleteAddress(userId, addressId);
            setAddresses(addresses.filter(address => address._id !== addressId));
        } catch (error) {
            console.error("Failed to delete address:", error);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!userId) return;
        try {
            await deleteCard(userId, cardId);
            setCards(cards.filter(card => card._id !== cardId));
        } catch (error) {
            console.error("Failed to delete card:", error);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!userId) return;
        try {
            await deleteMyReview(userId, reviewId);
            setReviews(reviews.filter(review => review._id !== reviewId));
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    const handleUpdateReview = async () => {
        if (!userId || !editingReviewId) return;
        try {
            await updateMyReview(userId, editingReviewId, newReview.rating, newReview.review);
            setReviews(reviews.map(review => 
                review._id === editingReviewId ? { ...review, ...newReview } : review
            ));
            setEditingReviewId(null);
            setNewReview({ rating: 0, review: '' });
        } catch (error) {
            console.error("Failed to update review:", error);
        }
    };

    const handleEditReview = (reviewId: string, currentReview: any) => {
        setEditingReviewId(reviewId);
        setNewReview({ rating: currentReview.rating, review: currentReview.review });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name in newAddress) {
            setNewAddress(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else if (name in newReview) {
            setNewReview(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else if (name in newCard) {
            setNewCard(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAddAddress = async () => {
        if (!userId) return;
        try {
            const addedAddress = await addAddress(userId, newAddress);
            setAddresses([...addresses, addedAddress]);
            setNewAddress({
                addresslabel: '',
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
                state: ''
            });
        } catch (error) {
            console.error("Failed to add address:", error);
        }
    };

    const handleAddCard = async () => {
        if (!userId) return;
        try {
            const addedCard = await addCard(userId, newCard);
            setCards([...cards, addedCard]);
            setNewCard({
                cardNumber: '',
                cardHolderName: '',
                expiryDate: ''
            });
        } catch (error) {
            console.error("Failed to add card:", error);
        }
    };

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center mt-20">
                    <h1 className={title()}>Personal Information</h1>
                </div>
                {userData && (
                    <div className="mt-4">
                        <p><strong>ID:</strong> {userData.id}</p>
                        <p><strong>First Name:</strong> {userData.first_name}</p>
                        <p><strong>Last Name:</strong> {userData.last_name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Company:</strong> {userData.company}</p>
                        {/* Other personal information fields */}
                    </div>
                )}
                {addresses.length > 0 && (
                    <div className="mt-4">
                        <h2 className={title()}>Address Information</h2>
                        {addresses.map(address => (
                            <div key={address._id} className="border p-4 mb-4">
                                <p><strong>Address Label:</strong> {address.addresslabel}</p>
                                <p><strong>Apartment:</strong> {address.apartment}</p>
                                <p><strong>Floor:</strong> {address.floor}</p>
                                <p><strong>Street:</strong> {address.street}</p>
                                <p><strong>Building:</strong> {address.building}</p>
                                <p><strong>Postal Code:</strong> {address.postal_code}</p>
                                <p><strong>Extra Description:</strong> {address.extra_description}</p>
                                <p><strong>City:</strong> {address.city}</p>
                                <p><strong>Country:</strong> {address.country}</p>
                                <p><strong>State:</strong> {address.state}</p>
                                <button
                                    onClick={() => handleDeleteAddress(address._id)}
                                    className="bg-red-500 text-white px-4 py-2 mt-2"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-8">
                    <h2 className={title()}>Add New Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.keys(newAddress).map((key) => (
                            <div key={key} className="flex flex-col">
                                <label htmlFor={key} className="mb-1 capitalize">{key.replace('_', ' ')}</label>
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={newAddress[key]}
                                    onChange={handleChange}
                                    className="border px-4 py-2"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleAddAddress}
                        className="bg-blue-500 text-white px-4 py-2 mt-4"
                    >
                        Add Address
                    </button>
                </div>
                {cards.length > 0 && (
                    <div className="mt-8">
                        <h2 className={title()}>Card Information</h2>
                        {cards.map(card => (
                            <div key={card._id} className="border p-4 mb-4">
                                <p><strong>Card Number:</strong> {card.cardNumber}</p>
                                <p><strong>Card Holder Name:</strong> {card.cardHolderName}</p>
                                <p><strong>Expiry Date:</strong> {card.expiryDate}</p>
                                <button
                                    onClick={() => handleDeleteCard(card._id)}
                                    className="bg-red-500 text-white px-4 py-2 mt-2"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-8">
                    <h2 className={title()}>Add New Card</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.keys(newCard).map((key) => (
                            <div key={key} className="flex flex-col">
                                <label htmlFor={key} className="mb-1 capitalize">{key.replace('_', ' ')}</label>
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={newCard[key]}
                                    onChange={handleChange}
                                    className="border px-4 py-2"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleAddCard}
                        className="bg-blue-500 text-white px-4 py-2 mt-4"
                    >
                        Add Card
                    </button>
                </div>
                {reviews.length > 0 && (
                    <div className="mt-8">
                        <h2 className={title()}>My Reviews</h2>
                        {reviews.map(review => (
                            <div key={review._id} className="border p-4 mb-4">
                                <p><strong>Product Name:</strong> {review.productName}</p>
                                <p><strong>Review:</strong> {review.review}</p>
                                <p><strong>Rating:</strong> {review.rating}</p>
                                <button
                                    onClick={() => handleEditReview(review._id, review)}
                                    className="bg-blue-500 text-white px-4 py-2 mt-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="bg-red-500 text-white px-4 py-2 mt-2"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {editingReviewId && (
                    <div className="mt-8">
                        <h2 className={title()}>Edit Review</h2>
                        <div className="flex flex-col">
                            <label htmlFor="rating" className="mb-1 capitalize">Rating</label>
                            <input
                                type="number"
                                id="rating"
                                name="rating"
                                value={newReview.rating}
                                onChange={handleChange}
                                className="border px-4 py-2"
                            />
                            <label htmlFor="review" className="mb-1 capitalize">Review</label>
                            <textarea
                                id="review"
                                name="review"
                                value={newReview.review}
                                onChange={handleChange}
                                className="border px-4 py-2"
                            />
                            <button
                                onClick={handleUpdateReview}
                                className="bg-green-500 text-white px-4 py-2 mt-4"
                            >
                                Update Review
                            </button>
                        </div>
                    </div>
                )}
                {orders.length > 0 && (
                    <div className="mt-8">
                        <h2 className={title()}>Previous Orders</h2>
                        <table className="min-w-full table-auto mt-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Order Number</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Items Purchased</th>
                                    <th className="px-4 py-2">Total Amount (EGP)</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td className="border px-4 py-2">{order._id}</td>
                                        <td className="border px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">
                                            <ul>
                                                {order.items.map(item => (
                                                    <li key={item.productId}>
                                                        {item.name} (x{item.quantity})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="border px-4 py-2">{(order.amount_cents / 100).toFixed(2)}</td>
                                        <td className="border px-4 py-2">{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </DefaultLayout>
    );
}