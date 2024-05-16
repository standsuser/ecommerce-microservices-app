import { MongoClient, ObjectId } from 'mongodb';

const url = 'mongodb://localhost:27018';
const dbName = 'user'; 

const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Insert addresses
    const addresses = [
      {
        userid: new ObjectId(),
        apartment: '10B',
        email: 'user1@example.com',
        floor: 10,
        first_name: 'John',
        street: 'Main St',
        building: 'A',
        phone_number: '1234567890',
        postal_code: 12345,
        extra_description: null,
        city: 'New York',
        country: 'USA',
        last_name: 'Doe',
        state: 'NY',
      },
      // add more addresses as needed
    ];
    const addressResult = await db.collection('addresses').insertMany(addresses);
    console.log(`${addressResult.insertedCount} addresses were inserted`);

    // Insert payments
    const payments = [
      {
        userid: addressResult.insertedIds[0], // reference to the userId from addresses
        billingAddress: addressResult.insertedIds[0], // reference to an address
        debitOrCredit: 'credit',
        cardNumber: '4111111111111111',
        cvv: '123',
        expiryDate: '12/25',
        cardHolderName: 'John Doe',
      },
      // add more payments as needed
    ];
    const paymentResult = await db.collection('payments').insertMany(payments);
    console.log(`${paymentResult.insertedCount} payments were inserted`);

    // Insert wishlists
    const wishlists = [
      {
        userid: addressResult.insertedIds[0], // reference to the userId from addresses
        productid: new ObjectId(), // replace with actual product ID
        selectedSize: 'M',
        selectedMaterial: 'Cotton',
        selectedColor: 'Blue',
      },
      // add more wishlists as needed
    ];
    const wishlistResult = await db.collection('wishlists').insertMany(wishlists);
    console.log(`${wishlistResult.insertedCount} wishlists were inserted`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
