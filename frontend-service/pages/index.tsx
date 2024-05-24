import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardFooter, Image, Button } from '@nextui-org/react';
import DefaultLayout from '@/layouts/default';
import { title } from "@/components/primitives";

const CatalogPage: React.FC = () => {
    const [featuredListings, setFeaturedListings] = useState<any[]>([]);
    const [topOffers, setTopOffers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const router = useRouter(); // Initialize router

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

    return (
        <DefaultLayout>
            <div>
                <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
                    <div className="max-w-lg text-center">
                        <h1 className={title()}>Welcome to </h1>
                        <h1 className={title({ color: "violet" })}>Our Website</h1>
                        <h2 className="text-2xl font-bold mb-4">Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <div key={index} onClick={() => router.push(`/category?categoryId=${category._id}`)}>
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
                        <h2 className="text-2xl font-bold mb-4 mt-8">Top Offers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topOffers.map((offer, index) => (
                                <Card key={index} isHoverable>
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
                            ))}
                        </div>
                    </div>
                    <Button
                        color="primary"
                        variant="shadow"
                        onClick={() => {}} // Add functionality if needed mycomment
                        className="mt-8"
                    >
                        Explore More
                    </Button>
                
                </section>
            </div>
        </DefaultLayout>
    );
};

export default CatalogPage;
