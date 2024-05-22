import { MongoClient, ObjectId } from 'mongodb';

const url = 'mongodb://localhost:27018';
const dbName = 'product'; // replace with your database name

const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const categories = [
      { name: 'Category 1', description: 'Description 1' },
      { name: 'Category 2', description: 'Description 2' },
      // add more categories as needed
    ];
    const categoryResult = await db.collection('categories').insertMany(categories);
    console.log(categoryResult.insertedCount + ' categories were inserted');

    // Insert products
    const products = [];
    for (let i = 1; i <= 20; i++) {
      products.push({
        name: `Product ${i}`,
        description: `Description ${i}`,
        imageURL: [`https://nextui.org/images/hero-card.jpeg`],
        availability: true,
        discountpercentage: Math.floor(Math.random() * (80 - 10 + 1)) + 10,
        validityperiod: new Date(),
        categoryId: categoryResult.insertedIds[0], // reference to a category
        sizes: ['small', 'medium', 'large'],
        colors: ['red', 'blue', 'green', 'black', 'white'],
        materials: ['plastic','wood', 'HDPEplastic'],
        totalPrice: 100 + i,
        totalRating: 5,
        totalReviews: 10 + i,
        rating: 5
      });
    }

    const productResult = await db.collection('products').insertMany(products);
    console.log(productResult.insertedCount + ' products were inserted');

    // Insert reviews
    const reviews = [];
    for (let i = 0; i < 20; i++) {
      reviews.push({
        userid: new ObjectId(),
        productid: productResult.insertedIds[i], // reference to a product
        rating: 5,
        review: 'Great product!',
        reviewdate: new Date(),
      });
    }
    const reviewResult = await db.collection('reviews').insertMany(reviews);
    console.log(reviewResult.insertedCount + ' reviews were inserted');

    // Insert favorites
    const favorites = [];
    for (let i = 0; i < 20; i++) {
      favorites.push({
        userid: new ObjectId(),
        productid: productResult.insertedIds[i], // reference to a product
      });
    }
    const favoriteResult = await db.collection('favorites').insertMany(favorites);
    console.log(favoriteResult.insertedCount + ' favorites were inserted');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
