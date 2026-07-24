const dotenv = require('dotenv');
const connectDB = require('./db');
const { customers, orders, policies } = require('./data');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Policy = require('./models/Policy');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Wipe old collections to prevent duplicate key errors
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Policy.deleteMany({});

    // Populate collections
    await Customer.insertMany(customers);
    await Order.insertMany(orders);

    // Transform policies object key-value pairs into array format
    const policyDocs = Object.keys(policies).map((topic) => ({
      topic,
      text: policies[topic],
    }));
    await Policy.insertMany(policyDocs);

    console.log('Data successfully imported into MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedData();