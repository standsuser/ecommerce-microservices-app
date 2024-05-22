import React from 'react';
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import Cart from '@/components/Cart';

const CartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <section className="flex flex-col md:flex-row items-start md:items-center justify-start gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center md:text-left justify-center md:justify-start mt-20 md:w-1/2">
          <div>
            <h1 className={title()}>Your</h1>
            <h1 className={title({ color: "violet" })}> Shopping Cart</h1>
          </div>
        </div>
        <div className="md:w-1/2">
          <Cart />
        </div>
      </section>
    </DefaultLayout>
  );
};

export default CartPage;