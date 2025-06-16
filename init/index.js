const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
  console.log('✅ MongoDB connection successful');
  initDB();
});

async function main() {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log('🧹 Previous listings deleted');

    // Add geometry field to each listing
    const listingsWithGeometry = initData.data.map((obj) => ({
      ...obj,
      owner: '68382dadabd806c17f582e4f', // Your user ID
      geometry: {
        type: 'Point',
        coordinates: [0, 0], // Placeholder coordinates (longitude, latitude)
      },
    }));

    await Listing.insertMany(listingsWithGeometry);
    console.log('✅ Listings inserted successfully');
  } catch (err) {
    console.error('❌ Error initializing DB:', err);
  }
};
