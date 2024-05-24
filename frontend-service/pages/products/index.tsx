import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

interface Product {
  id: string;
  imageURL: string;
  name: string;
  totalPrice: number;
  availability: boolean;
  description: string;
  sizes: string[];
  colors: string[];
  materials: string[];
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]); // Provide type annotation for products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/product/all");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/product/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const productData = await response.json();
      console.log("Product Details:", productData);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
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
          <Link href={`/productDetails`} key={index}> 
            <div className="relative">
              <div onClick={() => handleProductClick(product.id)}>
                <Card isFooterBlurred radius="lg" className="border-none flex-grow cursor-pointer">
                  <Image
                    src={product.imageURL}
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
                    </div>
                  </CardFooter>
                </Card>
              </div>
              <div className="text-center mt-4 space-x-4">
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  className="text-sm text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
                >
                  Add to cart
                </Button>
                <Button
                  onClick={() => handleRent(product.id)}
                  className="text-sm text-white bg-green-500 hover:bg-green-600 focus:bg-green-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
                >
                  Rent
                </Button>
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
