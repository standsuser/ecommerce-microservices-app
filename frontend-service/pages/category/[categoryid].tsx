// pages/category/[categoryid].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { GetServerSideProps } from "next";

interface Product {
  _id: string;
  name: string;
  category: string;
}

interface CategoryPageProps {
  initialProducts: Product[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ initialProducts }) => {
  const router = useRouter();
  const { categoryid } = router.query;
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryid && !initialProducts.length) {
      setLoading(true);
      axios
        .get<Product[]>(`http://localhost:3000/products/${categoryid}`)
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [categoryid, initialProducts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading products: {error}</p>;

  return (
    <div>
      <h1>Category: {categoryid}</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { categoryid } = context.params!;
  try {
    const response = await axios.get<Product[]>(
      `http://localhost:3000/products/${categoryid}`
    );
    return {
      props: {
        initialProducts: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        initialProducts: [],
      },
    };
  }
};

export default CategoryPage;
