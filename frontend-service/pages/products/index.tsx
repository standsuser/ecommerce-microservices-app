import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import { getAllProducts, getProductReviews } from "@/pages/api/productApi";

interface Product {
  _id: string;
  imageURL: string[];
  name: string;
  totalPrice: number;
  availability: boolean;
  description: string;
  sizes: string[];
  colors: string[];
  materials: string[];
  rating: number;
  totalRating: number;
  totalReviews: number;
}

interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});

  useEffect(() => {
    const fetchProductsAndReviews = async () => {
      try {
        const products = await getAllProducts();
        setProducts(products);

        // Fetch reviews for each product
        products.forEach(async (product: Product) => {
          try {
            const reviews = await getProductReviews(product._id);
            setReviews((prev) => ({ ...prev, [product._id]: reviews }));
          } catch (error) {
            if (error.message === 'Failed to fetch product reviews') {
              setReviews((prev) => ({ ...prev, [product._id]: [] }));
            } else {
              console.error("Error fetching reviews:", error);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching products and reviews:", error);
      }
    };
    fetchProductsAndReviews();
  }, []);

  const calculateAverageRating = (product: Product) => {
    return product.totalReviews ? ((product.totalRating / product.totalReviews) * 10).toFixed(1) : "No ratings yet";
  };

  const handleAddToCart = (productId: string) => {
    console.log("Adding product to cart:", productId);
  };

  const handleRent = (productId: string) => {
    console.log("Renting product:", productId);
  };

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
        {products.map((product, index) => (
          <Link href={`/productDetails?id=${product._id}`} key={index}>
            <div className="relative">
              <Card isFooterBlurred radius="lg" className="border-none flex-grow cursor-pointer">
                <Image
                  src={product.imageURL[0]}
                  alt={product.name}
                  width="100%"
                  height={200}
                  className="object-cover"
                />
                <CardFooter>
                  <div className="text-center">
                    <p className="text-lg text-white font-semibold mb-2">{product.name}</p>
                    <p className="text-sm text-white/80 mb-2">Price: ${product.totalPrice}</p>
                    <p className="text-sm text-white/80 mb-2">Availability: {product.availability ? "In Stock" : "Out of Stock"}</p>
                    <p className="text-sm text-white/80 mb-2">Description: {product.description}</p>
                    <p className="text-sm text-white/80 mb-2">Sizes: {product.sizes.join(", ")}</p>
                    <p className="text-sm text-white/80 mb-2">Colors: {product.colors.join(", ")}</p>
                    <p className="text-sm text-white/80 mb-2">Materials: {product.materials.join(", ")}</p>
                    <p className="text-sm text-yellow-500 mb-2">Rating: {calculateAverageRating(product)}</p>
                  </div>
                </CardFooter>
              </Card>
              <div className="text-center mt-4 space-x-4">
                <Button
                  onClick={() => handleAddToCart(product._id)}
                  className="text-sm text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
                >
                  Add to cart
                </Button>
                <Button
                  onClick={() => handleRent(product._id)}
                  className="text-sm text-white bg-green-500 hover:bg-green-600 focus:bg-green-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
                >
                  Rent
                </Button>
              </div>
              <div className="mt-4">
                <h4 className="text-center text-lg font-semibold">Reviews</h4>
                {reviews[product._id] && reviews[product._id].length > 0 ? (
                  reviews[product._id].map((review) => (
                    <div key={review._id} className="bg-gray-800 text-white p-4 rounded-lg mt-2">
                      <p className="text-sm">Rating: {review.rating} stars</p>
                      <p className="text-sm">Comment: {review.comment}</p>
                      <p className="text-xs text-gray-400">Posted on: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No reviews yet</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">© 2024 Your Website. All rights reserved.</p>
      </div>
    </DefaultLayout>
  );
};

export default ProductPage;
