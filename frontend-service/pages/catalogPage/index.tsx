import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react'; // Import button component
import DefaultLayout from '@/layouts/default';

const CatalogPage: React.FC = () => {
    const [featuredListings, setFeaturedListings] = useState<any[]>([]);
    const [topOffers, setTopOffers] = useState<any[]>([]);

    useEffect(() => {
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

        fetchFeaturedListings();
        fetchTopOffers();
    }, []);

    return (
        <div>
            <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
                <div className="max-w-lg text-center">
                    <h2 className="text-2xl font-bold mb-4">Featured Listings</h2>
                    <ul className="list-none">
                        {featuredListings.map((listing, index) => (
                            <li key={index} className="mb-4">
                                <img src={listing.imageURL} alt={listing.name} className="w-32 h-32 object-cover mb-2" />
                                <div>Name: {listing.name}</div>
                                <div>Rating: {listing.rating}</div>
                                <div>Price: ${listing.totalPrice}</div>
                            </li>
                        ))}
                    </ul>
                    <h2 className="text-2xl font-bold mb-4 mt-8">Top Offers</h2>
                    <ul className="list-none">
                        {topOffers.map((offer, index) => (
                            <li key={index} className="mb-4">
                                <img src={offer.imageURL} alt={offer.name} className="w-32 h-32 object-cover mb-2" />
                                <div>Name: {offer.name}</div>
                                <div>Discount Percentage: {offer.discountpercentage}%</div>
                                <div>Valid Until: {new Date(offer.validityperiod).toLocaleDateString()}</div>
                                <div>Rating: {offer.rating}</div>
                                <div>Price: ${offer.totalPrice}</div>
                            </li>
                        ))}
                    </ul>
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
        </div>
    );
};

export default CatalogPage;
