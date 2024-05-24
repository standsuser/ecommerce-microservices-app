import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import { getAllProducts, addFavorite } from "@/pages/api/productApi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

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

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUserId(localStorage.getItem('user'));
    setSessionId(localStorage.getItem('sessionId'));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setProducts(products);
      } catch (error: any) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const calculateAverageRating = (product: Product) => {
    return product.totalReviews ? ((product.totalRating / product.totalReviews) * 10).toFixed(1) : "No ratings yet";
  };

  const handleAddToCart = async (productId: string, item: any) => {
    try {
      const payload = {
        quantity: 1,
        rentalDuration: "",
        name: item.name,
        amount_cents: item.totalPrice * 100, // multiply totalPrice by 100
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

  const handleRent = (productId: string) => {
    router.push(`/cart?productId=${productId}`);
  };

  const handleViewDetails = (productId: string) => {
    router.push(`/productDetails?id=${productId}`);
  };

  return (
    <DefaultLayout>
      <ToastContainer />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        {products.map((product, index) => (
          <div key={index} style={{ flex: '1 1 calc(25% - 16px)', boxSizing: 'border-box' }}>
            <Link href={`/productDetails?id=${product._id}`} passHref>
              <Card isPressable isHoverable>
                <div style={{ padding: 0 }}>
                  <img
                    src={product.imageURL[0]}
                    style={{ objectFit: "cover", width: "100%", height: "200px" }}
                    alt={product.name}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <h3>{product.name}</h3>
                  <p>Price: ${product.totalPrice}</p>
                  <p>Availability: {product.availability ? "In Stock" : "Out of Stock"}</p>
                  <p>{product.description}</p>
                  <p>Sizes: {product.sizes.join(", ")}</p>
                  <p>Colors: {product.colors.join(", ")}</p>
                  <p>Materials: {product.materials.join(", ")}</p>
                  <p>Rating: {calculateAverageRating(product)}</p>
                </div>
              </Card>
            </Link>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Button onClick={() => handleAddToWishlist(product._id)} color="secondary" style={{ margin: '4px' }}>
                Add to Wishlist
              </Button>
              <Button onClick={() => handleAddToFavorites(product._id)} color="warning" style={{ margin: '4px' }}>
                Add to Favorites
              </Button>
              <Button onClick={() => handleViewDetails(product._id)} color="primary" style={{ margin: '4px' }}>
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: "#1a1a1a", color: "white", padding: "1rem", textAlign: "center", marginTop: "2rem" }}>
        <p>&copy; 2024 Your Website. All rights reserved.</p>
      </div>
    </DefaultLayout>
  );
};

export default ProductPage;