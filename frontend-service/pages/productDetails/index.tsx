import React, { useState, useEffect } from "react";
import { Button, Card, CardFooter, Image } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import { addItemToCart } from "@/pages/api/cartApi";
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import 'react-toastify/dist/ReactToastify.css';

const sizePrices: { [key: string]: number } = { small: 5, medium: 10, large: 15 };
const colorPrices: { [key: string]: number } = { red: 2, blue: 3, green: 4, black: 5, white: 6 };
const materialPrices: { [key: string]: number } = { plastic: 20, wood: 30, HDPEplastic: 40 };
const rentalPrices: { [key: string]: number } = { none: 0, '1 week': 20, '1 month': 50, '6 months': 100 };

const ProductDetailsPage: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const [size, setSize] = useState<string>("medium");
  const [color, setColor] = useState<string>("black");
  const [material, setMaterial] = useState<string>("wood");
  const [rentalDuration, setRentalDuration] = useState<string>("none");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
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
      fetchProductReviews(productId);
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

  const fetchProductReviews = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/product/review/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(`Error fetching reviews for product ID ${productId}:`, error);
    }
  };

  const handleAddReview = async () => {
    try {
      const response = await fetch(`http://localhost:3000/product/review/add/${product._id}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, review })
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setRating(0);
      setReview("");
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Failed to add review:', error);
      toast.error('Failed to add review');
    }
  };

  const totalPrice =
    basePrice +
    sizePrices[size] +
    colorPrices[color] +
    materialPrices[material] +
    rentalPrices[rentalDuration];

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

      const userOrSessionId = userId || sessionId;
      if (!userOrSessionId) {
        throw new Error('User or session ID not found');
      }

      await addItemToCart(userOrSessionId, product._id, addItemDto, !!userId);

      toast.success('Item added to cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleRentToCart = async () => {
    try {
      const addItemDto = {
        rentalDuration,
        isRented: true,
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

  const shareUrl = window.location.href;
  const shareTitle = `Check out this product: ${product.name}`;

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
                <label>
                  Select Rental Duration:
                  <select value={rentalDuration} onChange={(e) => setRentalDuration(e.target.value)}>
                    <option value="none">None</option>
                    <option value="1 week">1 week</option>
                    <option value="1 month">1 month</option>
                    <option value="6 months">6 months</option>
                  </select>
                </label>
              </div>
              <p className="text-lg font-semibold mt-2">${totalPrice.toFixed(2)}</p>
              <div className="flex space-x-2 mt-4">
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={shareTitle} separator=":: ">
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button className="text-sm text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm" onClick={handleAddToWishlist}>
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
                onClick={handleRentToCart}
              >
                Rent
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="mt-4">
        <h4 className="text-center text-lg font-semibold">Reviews</h4>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-gray-800 text-white p-4 rounded-lg mt-2">
              <p className="text-sm">Rating: {review.rating} stars</p>
              <p className="text-sm">Comment: {review.review}</p>
              <p className="text-xs text-gray-400">Posted on: {new Date(review.reviewdate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No reviews yet</p>
        )}
      </div>
      <div className="mt-4">
        <h4 className="text-center text-lg font-semibold">Add a Review</h4>
        <div className="flex flex-col items-center">
          <label className="mb-2">
            Rating:
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2">
              <option value={0}>Select rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            placeholder="Write your review here..."
            className="mb-2 p-2 w-full border border-gray-300 rounded-md"
          />
          <Button
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none px-4 py-2 rounded-full shadow-lg"
            onClick={handleAddReview}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProductDetailsPage;