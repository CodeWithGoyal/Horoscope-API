const mongoose = require('mongoose');
const User = require('../models/User');

// Increase timeout for database operations
jest.setTimeout(30000);

// Connect to test database before all tests
beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/horoscope-api-test';
  await mongoose.connect(testDbUri);
  await User.init(); // Ensures indexes are created
});

// Clean up database after each test
afterEach(async () => {
  // Delete all documents, but keep indexes
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
}); 