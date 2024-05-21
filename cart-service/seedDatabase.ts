import { MongoClient, ObjectId } from 'mongodb';

const url = 'mongodb://localhost:27018';
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
        userId: new ObjectId('617bf6d02d1842e5388d893f'),
        items: [
          {
            product_id: new ObjectId('615f3a5509d312630bb048f2'),
            rentalDuration: '1 week',
            isRented: false,
            name: 'Product 1',
            amount_cents: 5000,
            description: 'Description of Product 1',
            color: 'Red',
            size: 'Medium',
            material: 'Cotton',
            quantity: 2
          }
        ],
        total_price_pre_coupon: 10000,
        total_price_post_coupon: 9000,
        coupon_code: 'SALE20',
        coupon_percentage: 10,
        is_checkout: false,
        updated_at: new Date()
      },
      // Include additional cart data as required
    ];

    // Insert orders
    const orders = [
      {
        userId: new ObjectId('617bf6d02d1842e5388d893f'),
        delivery_needed: true,
        amount_cents: 9000,
        currency: 'USD',
        merchant_order_id: 123456789,
        items: [
          {
            product_id: new ObjectId('615f3a5509d312630bb048f2'),
            name: 'Product 1',
            amount_cents: 5000,
            description: 'Description of Product 1',
            color: 'Red',
            size: 'Medium',
            material: 'Cotton',
            quantity: 2
          }
        ],
        status: 'PENDING',
        shipping_data: {
          apartment: '202',
          email: 'user@example.com',
          floor: '2',
          first_name: 'John',
          street: '123 Main St',
          building: 'A',
          phone_number: '1234567890',
          postal_code: '10001',
          extra_description: null,
          city: 'New York',
          country: 'USA',
          last_name: 'Doe',
          state: 'NY'
        },
        payment_info: {
          order_id: 123456789,
          amount_cents: 5000,
          expiration: 202512,
          billing_data: {
            apartment: '202',
            email: 'user@example.com',
            floor: '2',
            first_name: 'John',
            street: '123 Main St',
            building: 'A',
            phone_number: '1234567890',
            postal_code: '10001',
            extra_description: 'Near the old bookstore',
            city: 'New York',
            country: 'USA',
            last_name: 'Doe',
            state: 'NY'
          },
          currency: 'USD',
          integration_id: 1,
          lock_order_when_paid: 'Yes'
        }
      },
      // Additional order data as required
    ];

    // Insert coupons
    const coupons = [
      {
        coupon_code: 'SALE20',
        coupon_percentage: 20
      },
      {
        coupon_code: 'NEWYEAR30',
        coupon_percentage: 30
      }
      // Additional coupon data as required
    ];

    const cartResult = await db.collection('carts').insertMany(carts);
    console.log(cartResult.insertedCount + ' carts were inserted');

    const orderResult = await db.collection('orders').insertMany(orders);
    console.log(orderResult.insertedCount + ' orders were inserted');

    const couponResult = await db.collection('coupons').insertMany(coupons);
    console.log(couponResult.insertedCount + ' coupons were inserted');

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
