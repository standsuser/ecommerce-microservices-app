import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardFooter, Image, Button } from '@nextui-org/react';
import DefaultLayout from '@/layouts/default';
import { title } from "@/components/primitives";
import { getAllProducts, addFavorite } from "@/pages/api/productApi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CatalogPage: React.FC = () => {
    const [featuredListings, setFeaturedListings] = useState<any[]>([]);
    const [topOffers, setTopOffers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUserId(localStorage.getItem('user'));
        setSessionId(localStorage.getItem('sessionId'));
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/product/category', {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProductDetails = async (productId: string) => {
            try {
                const response = await fetch(`http://localhost:3000/product/${productId}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                return await response.json();
            } catch (error) {
                console.error(`Error fetching details for product ID ${productId}:`, error);
                return null;
            }
        };

        const fetchFeaturedListings = async () => {
            try {
                const response = await fetch('http://localhost:3001/catalog/featured', {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch featured listings');
                }
                const data = await response.json();
                const detailedListings = await Promise.all(data.map((listing: any) => fetchProductDetails(listing.productId)));
                setFeaturedListings(detailedListings.filter((listing: any) => listing !== null));
            } catch (error) {
                console.error('Error fetching featured listings:', error);
            }
        };

        const fetchTopOffers = async () => {
            try {
                const response = await fetch('http://localhost:3001/catalog/topoffers', {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch top offers');
                }
                const data = await response.json();
                const detailedOffers = await Promise.all(data.map((offer: any) => fetchProductDetails(offer.productId)));
                setTopOffers(detailedOffers.filter((offer: any) => offer !== null));
            } catch (error) {
                console.error('Error fetching top offers:', error);
            }
        };

        fetchCategories();
        fetchFeaturedListings();
        fetchTopOffers();
    }, []);

    const handleCardClick = (productId: string) => {
        router.push(`/productDetails?id=${productId}`);
    };

    const handleAddToFavorites = async (productId: string) => {
        try {
            const selectedColor = "red";
            const selectedMaterial = "plastic";
            const selectedSize = "medium";
            await addFavorite(userId as string, productId, selectedColor, selectedMaterial, selectedSize);
            toast.success('Item added to favorites successfully');
        } catch (error: any) {
            console.error('Failed to add item to favorites:', error);
            toast.error('Failed to add item to favorites');
        }
    };

    return (
        <DefaultLayout>
            <div>
                <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
                    <div className="max-w-lg text-center">
                        <h1 className={title()}>Welcome to </h1>
                        <h1 className={title({ color: "violet" })}>Our Website</h1>
                        <h2 className="text-2xl font-bold mb-4">Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div key={category._id} onClick={() => router.push(`/category?categoryId=${category._id}`)}>
                                    <Card isHoverable>
                                        <Image src={category.imageURL} alt={category.name} width="100%" height={140} />
                                        <CardFooter>
                                            <div className="flex flex-col">
                                                <div><strong>Name:</strong> {category.name}</div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>
                            ))}
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Featured Listings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredListings.map((listing) => (
                                <div key={listing._id} onClick={() => handleCardClick(listing._id)}>
                                    <Card isHoverable>
                                        <Image src={listing.imageURL} alt={listing.name} width="100%" height={140} />
                                        <CardFooter>
                                            <div className="flex flex-col">
                                                <div><strong>Name:</strong> {listing.name}</div>
                                                <div><strong>Rating:</strong> {listing.rating}</div>
                                                <div><strong>Price:</strong> ${listing.totalPrice}</div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                    <Button
                                        onClick={() => handleAddToFavorites(listing._id)}
                                        className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none px-4 py-2 rounded-full shadow-lg mt-2"
                                    >
                                        Add to Favorites
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <h2 className="text-2xl font-bold mb-4 mt-8">Top Offers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topOffers.map((offer) => (
                                <div key={offer._id} onClick={() => handleCardClick(offer._id)}>
                                    <Card isHoverable>
                                        <Image src={offer.imageURL} alt={offer.name} width="100%" height={140} />
                                        <CardFooter>
                                            <div className="flex flex-col">
                                                <div><strong>Name:</strong> {offer.name}</div>
                                                <div><strong>Discount Percentage:</strong> {offer.discountpercentage}%</div>
                                                <div><strong>Valid Until:</strong> {new Date(offer.validityperiod).toLocaleDateString()}</div>
                                                <div><strong>Rating:</strong> {offer.rating}</div>
                                                <div><strong>Price:</strong> ${offer.totalPrice}</div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                    <Button
                                        onClick={() => handleAddToFavorites(offer._id)}
                                        className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none px-4 py-2 rounded-full shadow-lg mt-2"
                                    >
                                        Add to Favorites
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        color="primary"
                        variant="shadow"
                        onClick={() => {}} // Add functionality if needed
                        className="mt-8"
                    >
                        Explore More
                    </Button>
                </section>
                <ToastContainer />
            </div>
        </DefaultLayout>
    );
};

export default CatalogPage;
