import React, { useState, useEffect } from "react";
import { Button, Card, CardFooter, Image } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import { addItemToCart } from "@/pages/api/cartApi";
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sizePrices: { [key: string]: number } = { small: 5, medium: 10, large: 15 };
const colorPrices: { [key: string]: number } = { red: 2, blue: 3, green: 4, black: 5, white: 6 };
const materialPrices: { [key: string]: number } = { plastic: 20, wood: 30, HDPEplastic: 40 };

const ProductDetailsPage: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const [size, setSize] = useState<string>("medium");
  const [color, setColor] = useState<string>("black");
  const [material, setMaterial] = useState<string>("wood");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const sessionId = localStorage.getItem('sessionId');
    setUserId(user);
    setSessionId(sessionId);

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
      fetchProductDetails(productId);
    }
  }, []);

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/product/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();
      setProduct(data);
      setBasePrice(data.totalPrice || 0);
    } catch (error) {
      console.error(`Error fetching details for product ID ${productId}:`, error);
    }
  };

  const totalPrice =
    basePrice +
    sizePrices[size] +
    colorPrices[color] +
    materialPrices[material];

  const handleAddToCart = async () => {
    try {
      const addItemDto = {
        rentalDuration: 'N/A',
        isRented: false,
        name: product.name,
        amount_cents: totalPrice * 100, // converting dollars to cents
        description: product.description,
        color,
        size,
        material,
        quantity: 1,
      };

      if (userId) {
        await addItemToCart(userId, product._id, addItemDto, true);
      } else if (sessionId) {
        await addItemToCart(sessionId, product._id, addItemDto, false);
      }

      toast.success('Item added to cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleRent = () => {
    router.push(`/cart?productId=${product._id}`);
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:3003/user/addToWishlist/${userId}/${product._id}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to add item to wishlist');
      }

      toast.success('Item added to wishlist successfully');
    } catch (error) {
      console.error('Failed to add item to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <DefaultLayout>
      <ToastContainer />
      <div className="flex justify-center items-center mt-8">
        <Card shadow="sm">
          <Image
            alt="Product Image"
            className="object-cover"
            height={400}
            src={product.imageURL && product.imageURL.length > 0 ? product.imageURL[0] : "https://nextui.org/images/hero-card.jpeg"}
            width={400}
          />
          <CardFooter className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
              <div className="flex flex-col mt-4 space-y-2">
                <label>
                  Select Size:
                  <select value={size} onChange={(e) => setSize(e.target.value)}>
                    {product.sizes.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Select Color:
                  <select value={color} onChange={(e) => setColor(e.target.value)}>
                    {product.colors.map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Select Material:
                  <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                    {product.materials.map((m: string) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="text-lg font-semibold mt-2">${totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button className="text-sm text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                Add to Wishlist
              </Button>
              <Button className="text-sm text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                Add to Favorites
              </Button>
              <Button
                className="text-sm text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                className="text-sm text-white bg-green-500 hover:bg-green-600 focus:bg-green-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
                onClick={handleRent}
              >
                Rent
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default ProductDetailsPage;
