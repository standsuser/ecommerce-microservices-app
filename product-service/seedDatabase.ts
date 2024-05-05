import { MongoClient, ObjectId } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'product'; // replace with your database name

const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Insert categories
    const categories = [
      { name: 'Category 1', description: 'Description 1' },
      { name: 'Category 2', description: 'Description 2' },
      // add more categories as needed
    ];
    const categoryResult = await db.collection('Category').insertMany(categories);
    console.log(categoryResult.insertedCount + ' categories were inserted');

    // Insert products
    const products = [
      {
        name: 'Product 1',
        description: 'Description 1',
        imageURL: ['http://example.com/image1.jpg'],
        availability: true,
        discountpercentage: 0,
        categoryIds: [categoryResult.insertedIds[0]], // reference to a category
        sizes: ['S', 'M', 'L'],
        colors: ['Red', 'Blue'],
        materials: ['Cotton'],
        totalPrice: 100,
        totalRating: 5,
        totalReviews: 10,
      },
      // add more products as needed
    ];
    const productResult = await db.collection('Product').insertMany(products);
    console.log(productResult.insertedCount + ' products were inserted');

    // Insert reviews
    const reviews = [
      {
        userid: new ObjectId(),
        productid: productResult.insertedIds[0], // reference to a product
        rating: 5,
        review: 'Great product!',
        reviewdate: new Date(),
      },
      // add more reviews as needed
    ];
    const reviewResult = await db.collection('Review').insertMany(reviews);
    console.log(reviewResult.insertedCount + ' reviews were inserted');

    // Insert favorites
    const favorites = [
      {
        userid: new ObjectId(),
        productid: productResult.insertedIds[0], // reference to a product
      },
      // add more favorites as needed
    ];
    const favoriteResult = await db.collection('Favorite').insertMany(favorites);
    console.log(favoriteResult.insertedCount + ' favorites were inserted');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);