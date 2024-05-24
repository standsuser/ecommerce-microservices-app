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
        addresslabel: 'Home',
        apartment: '101',
        email: 'example1@example.com',
        floor: 1,
        first_name: 'John',
        street: 'Main St',
        building: 'A',
        phone_number: '1234567890',
        postal_code: 12345,
        extra_description: 'Near the park',
        city: 'New York',
        country: 'USA',
        last_name: 'Doe',
        state: 'NY',
      },
      {
        userid: new ObjectId(),
        addresslabel: 'Work',
        apartment: '202',
        email: 'example2@example.com',
        floor: 2,
        first_name: 'Jane',
        street: 'Broadway',
        building: 'B',
        phone_number: '0987654321',
        postal_code: 67890,
        extra_description: 'Near the office',
        city: 'Los Angeles',
        country: 'USA',
        last_name: 'Smith',
        state: 'CA',
      },
      // add more addresses as needed
    ];
    const addressResult = await db.collection('addresses').insertMany(addresses);
    console.log(`${addressResult.insertedCount} addresses were inserted`);

    // Insert payments
    const payments = [
      {
        userid: '664e0895f80e44d1d008abf2', // reference to the userId from addresses
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
      userid: new ObjectId('664e0895f80e44d1d008abf2'), // reference to the userId from addresses
      productid: new ObjectId('664e3edd232fd5f39b78eec3'), // replace with actual product ID
      selectedSize: 'medium',
      selectedMaterial: 'plastic',
      selectedColor: 'red',
      },
      {
        userid: new ObjectId('664e0895f80e44d1d008abf2'), // reference to the userId from addresses
        productid: new ObjectId('664e3edd232fd5f39b78eec8'), // replace with actual product ID
        selectedSize: 'medium',
        selectedMaterial: 'plastic',
        selectedColor: 'red',
        },
        {
          userid: new ObjectId('664e0895f80e44d1d008abf2'), // reference to the userId from addresses
          productid: new ObjectId('664e3edd232fd5f39b78eecc'), // replace with actual product ID
          selectedSize: 'medium',
          selectedMaterial: 'plastic',
          selectedColor: 'red',
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
