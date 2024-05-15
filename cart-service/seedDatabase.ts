import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'cart'; // replace with your database name

const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Insert carts
    const carts = [
      {
        user_id: '617bf6d02d1842e5388d893f',
        items: [
            {
                productId: '615f3a5509d312630bb048f2',
                rentalDuration: '1 week',
                isRented: false,
                name: 'Product 1',
                amount_cents: 5000,
                description: 'Description of Product 1',
                color: 'Red',
                size: 'Medium',
                material: 'Cotton',
                quantity: 2
            },
            {
                productId: '615f3a5509d312630bb048f3',
                rentalDuration: '2 weeks',
                isRented: true,
                name: 'Product 2',
                amount_cents: 7500,
                description: 'Description of Product 2',
                color: 'Blue',
                size: 'Large',
                material: 'Polyester',
                quantity: 1
            }
        ],
        total_price_pre_coupon: 12500,
        total_price_post_coupon: 11250,
        coupon_code: 'SALE20',
        coupon_percentage: 10,
        is_checkout: false,
        updated_at: new Date()
      },
      {
        sessiond_id: 'abc123',
        items: [
            {
                productId: '615f3a5509d312630bb048f4',
                rentalDuration: '3 days',
                isRented: false,
                name: 'Product 3',
                amount_cents: 2000,
                description: 'Description of Product 3',
                color: 'Green',
                size: 'Small',
                material: 'Wool',
                quantity: 3
            }
        ],
        total_price_pre_coupon: 6000,
        total_price_post_coupon: null,
        coupon_code: null,
        coupon_percentage: 0,
        is_checkout: false,
        updated_at: new Date()
      }
    ];

    const cartResult = await db.collection('carts').insertMany(carts);
    console.log(cartResult.insertedCount + ' carts were inserted');
    
  } finally {
    await client.close();
  }
}

run().catch(console.dir);