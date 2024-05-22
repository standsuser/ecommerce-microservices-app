import React from "react";
import { Button, Card, CardFooter, Image } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

export default function ProductDetailsPage() {
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center mt-8">
        <Card shadow="sm">
          <Image
            alt="Product Image"
            className="object-cover"
            height={400}
            src="https://nextui.org/images/hero-card.jpeg"
            width={400}
          />
          <CardFooter className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold mb-2">Product Name</h2>
              <p className="text-sm text-gray-600">Product description goes here.</p>
              <p className="text-lg font-semibold mt-2">$99.99</p>
            </div>
            <Button
              className="text-sm text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}
