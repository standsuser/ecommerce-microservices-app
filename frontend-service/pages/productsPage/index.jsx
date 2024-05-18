import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

export default function App() {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(15)].map((_, index) => (
          <Card key={index} isFooterBlurred radius="lg" className="border-none flex-grow">
            <Image
              alt="Woman listening to music"
              className="object-cover"
              height={200}
              src="https://nextui.org/images/hero-card.jpeg"
              width={200}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">Product Name</p>
              <Button
                className="text-tiny text-white bg-black/20"
                variant="flat"
                color="default"
                radius="lg"
                size="sm"
              >
                Add to cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DefaultLayout>
  );
}
