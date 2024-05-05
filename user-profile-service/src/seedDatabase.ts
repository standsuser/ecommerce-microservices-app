import * as mongoose from 'mongoose';
import { UserSchema, OrderSchema, AddressSchema } from './schema'; // Adjust the import path as necessary

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);
const Address = mongoose.model('Address', AddressSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://host.docker.internal:27017/software2', {
      
     
    });

    // Clean up the database before seeding
    await User.deleteMany({});
    await Order.deleteMany({});
    await Address.deleteMany({});

    // Add your seeding logic here...

    console.log('Database seeded!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

seedDatabase();
