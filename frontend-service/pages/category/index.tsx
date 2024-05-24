import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from "@/layouts/default";
import { getAllProducts, addFavorite } from "@/pages/api/productApi";
import Link from "next/link";

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

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('user'));
  }, []);

  const calculateAverageRating = (product: Product) => {
    return product.totalReviews ? ((product.totalRating / product.totalReviews) * 10).toFixed(1) : "No ratings yet";
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

  const handleAddToCart = async (productId: string, item: Product) => {
    try {
      const payload = {
        quantity: 1,
        rentalDuration: "",
        name: item.name,
        amount_cents: item.totalPrice * 100,
        description: item.description,
        color: "red",
        size: "medium",
        material: "plastic"
      };

      const response = await fetch(`http://localhost:3015/cart/${userId}/add-item/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      toast.success('Item added to cart successfully');
    } catch (error: any) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleRent = (productId: string) => {
    router.push(`/cart?productId=${productId}`);
  };

  const handleViewDetails = (productId: string) => {
    router.push(`/productDetails?id=${productId}`);
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/user/addWishlist/${userId}/${productId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to add item to wishlist');
      }

      toast.success('Item added to wishlist successfully');
    } catch (error: any) {
      console.error('Failed to add item to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };

  useEffect(() => {
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          const response = await fetch(`http://localhost:3000/product/products/${categoryId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch category');
          }
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      };

      fetchCategory();
    }
  }, [categoryId]);

  return (
    <DefaultLayout>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
        {products.map((product) => (
          <div key={product._id} className="relative">
            <Link href={`/productDetails?id=${product._id}`} legacyBehavior>
              <Card radius="lg" className="border-none flex-grow cursor-pointer">
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
            </Link>
            <div className="text-center mt-4 space-x-4">
              <Button
                onClick={() => handleAddToFavorites(product._id)}
                className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
              >
                Add to Favorites
              </Button>
              <Button
                onClick={() => handleAddToWishlist(product._id)}
                className="text-sm text-white bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
              >
                Add to Wishlist
              </Button>
              <Button
                onClick={() => handleViewDetails(product._id)}
                className="text-sm text-white bg-gray-500 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">© 2024 Your Website. All rights reserved.</p>
      </div>
    </DefaultLayout>
  );
};

export default CategoryPage;
