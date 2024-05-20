import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react'; // Import button component
import DefaultLayout from '@/layouts/default';

const CatalogPage: React.FC = () => {
    const [featuredListings, setFeaturedListings] = useState<any[]>([]);
    const [topOffers, setTopOffers] = useState<any[]>([]);

    useEffect(() => {
        const fetchFeaturedListings = async () => {
            try {
                const response = await fetch('http://localhost:3001/catalog/featured', {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch featured listings');
                }
                
                const data = await response.json();
                console.log(data);
                setFeaturedListings(data);

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
                console.log(data);

                setTopOffers(data);
                console.log(response)

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
                                <div>name: {listing.name}</div>
                                <div>Rating: {listing.rating}</div>
                                <div>Price: ${listing.price}</div>
                            </li>
                        ))}
                    </ul>
                    <h2 className="text-2xl font-bold mb-4 mt-8">Top Offers</h2>
                    <ul className="list-none">
                        {topOffers.map((offer, index) => (
                            <li key={index} className="mb-4">
                                <img src={offer.imageURL} alt={offer.name} className="w-32 h-32 object-cover mb-2" />
                                <div> name: {offer.name}</div>
                                <div>Rating: {offer.rating}</div>
                                <div>Price: ${offer.price}</div>
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
