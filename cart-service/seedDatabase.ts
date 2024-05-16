import { MongoClient } from 'mongodb';

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
      // {
      //   userId: '617bf6d02d1842e5388d893f',
      //   items: [
      //       {
      //           productId: '615f3a5509d312630bb048f2',
      //           rentalDuration: '1 week',
      //           isRented: false,
      //           name: 'Product 1',
      //           amount_cents: 5000,
      //           description: 'Description of Product 1',
      //           color: 'Red',
      //           size: 'Medium',
      //           material: 'Cotton',
      //           quantity: 2
      //       },
      //       {
      //           productId: '615f3a5509d312630bb048f3',
      //           rentalDuration: '2 weeks',
      //           isRented: true,
      //           name: 'Product 2',
      //           amount_cents: 7500,
      //           description: 'Description of Product 2',
      //           color: 'Blue',
      //           size: 'Large',
      //           material: 'Polyester',
      //           quantity: 1
      //       }
      //   ],
      //   total_price_pre_coupon: 12500,
      //   total_price_post_coupon: 11250,
      //   coupon_code: 'SALE20',
      //   coupon_percentage: 10,
      //   is_checkout: false,
      //   updated_at: new Date()
      // },
      // {
      //   sessiond_id: 'abc123',
      //   items: [
      //       {
      //           productId: '615f3a5509d312630bb048f4',
      //           rentalDuration: '3 days',
      //           isRented: false,
      //           name: 'Product 3',
      //           amount_cents: 2000,
      //           description: 'Description of Product 3',
      //           color: 'Green',
      //           size: 'Small',
      //           material: 'Wool',
      //           quantity: 3
      //       }
      //   ],
      //   total_price_pre_coupon: 6000,
      //   total_price_post_coupon: null,
      //   coupon_code: null,
      //   coupon_percentage: 0,
      //   is_checkout: false,
      //   updated_at: new Date()
      // },
      // {
      //   userId: '617bf6d02d1842e5388d8940',
      //   items: [
      //       {
      //           productId: '615f3a5509d312630bb048f5',
      //           rentalDuration: '5 days',
      //           isRented: false,
      //           name: 'Product 4',
      //           amount_cents: 3000,
      //           description: 'Description of Product 4',
      //           color: 'Yellow',
      //           size: 'Large',
      //           material: 'Silk',
      //           quantity: 1
      //       }
      //   ],
      //   total_price_pre_coupon: 3000,
      //   total_price_post_coupon: 2700,
      //   coupon_code: 'DISCOUNT10',
      //   coupon_percentage: 10,
      //   is_checkout: false,
      //   updated_at: new Date()
      // },
      // {
      //   sessiond_id: 'def456',
      //   items: [
      //       {
      //           productId: '615f3a5509d312630bb048f6',
      //           rentalDuration: '1 month',
      //           isRented: true,
      //           name: 'Product 5',
      //           amount_cents: 10000,
      //           description: 'Description of Product 5',
      //           color: 'Black',
      //           size: 'Extra Large',
      //           material: 'Denim',
      //           quantity: 1
      //       },
      //       {
      //           productId: '615f3a5509d312630bb048f7',
      //           rentalDuration: '2 months',
      //           isRented: false,
      //           name: 'Product 6',
      //           amount_cents: 20000,
      //           description: 'Description of Product 6',
      //           color: 'White',
      //           size: 'Small',
      //           material: 'Leather',
      //           quantity: 2
      //       }
      //   ],
      //   total_price_pre_coupon: 30000,
      //   total_price_post_coupon: 27000,
      //   coupon_code: 'SAVE10',
      //   coupon_percentage: 10,
      //   is_checkout: true,
      //   updated_at: new Date()
      // },
      // // Add additional 6 cart instances as needed
      // {
      //   userId: '617bf6d02d1842e5388d8941',
      //   items: [
      //       {
      //           productId: '615f3a5509d312630bb048f8',
      //           rentalDuration: '2 weeks',
      //           isRented: true,
      //           name: 'Product 7',
      //           amount_cents: 7000,
      //           description: 'Description of Product 7',
      //           color: 'Pink',
      //           size: 'Medium',
      //           material: 'Cotton',
      //           quantity: 2
      //       }
      //   ],
      //   total_price_pre_coupon: 7000,
      //   total_price_post_coupon: 6300,
      //   coupon_code: 'SUMMER10',
      //   coupon_percentage: 10,
      //   is_checkout: false,
      //   updated_at: new Date()
      // },
      // {
      //   sessiond_id: 'ghi789',
      //   items: [
      //       {
      //           productId: '615f3a5509d312630bb048f9',
      //           rentalDuration: '3 weeks',
      //           isRented: false,
      //           name: 'Product 8',
      //           amount_cents: 8000,
      //           description: 'Description of Product 8',
      //           color: 'Gray',
      //           size: 'Large',
      //           material: 'Linen',
      //           quantity: 1
      //       }
      //   ],
      //   total_price_pre_coupon: 8000,
      //   total_price_post_coupon: 7200,
      //   coupon_code: 'AUTUMN10',
      //   coupon_percentage: 10,
      //   is_checkout: true,
      //   updated_at: new Date()
      // },
      {
        userId: 'mydadlovesme789',
        items: [
            {
                productId: '615f3a5509d312630bb048fa',
                rentalDuration: '1 week',
                isRented: false,
                name: 'Product 9',
                amount_cents: 9000,
                description: 'Description of Product 9',
                color: 'Purple',
                size: 'Small',
                material: 'Satin',
                quantity: 1
            }
        ],
        total_price_pre_coupon: 9000,
        total_price_post_coupon: null,
        coupon_code: null,
        coupon_percentage: null,
        is_checkout: false,
        updated_at: new Date()
      },
      // {
      //   sessiond_id: 'jkl012',
      //   items: [
      //       {
      //           productId: '615f3a5509d312630bb048fb',
      //           rentalDuration: '1 day',
      //           isRented: true,
      //           name: 'Product 10',
      //           amount_cents: 1000,
      //           description: 'Description of Product 10',
      //           color: 'Brown',
      //           size: 'Medium',
      //           material: 'Velvet',
      //           quantity: 1
      //       }
      //   ],
      //   total_price_pre_coupon: 1000,
      //   total_price_post_coupon: 1000,
      //   coupon_code: null,
      //   coupon_percentage: 0,
      //   is_checkout: true,
      //   updated_at: new Date()
      // }
    ];

    const cartResult = await db.collection('carts').insertMany(carts);
    console.log(cartResult.insertedCount + ' carts were inserted');
    
  } finally {
    await client.close();
  }
}

run().catch(console.dir);