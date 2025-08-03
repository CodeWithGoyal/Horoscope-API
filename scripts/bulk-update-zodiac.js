require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const { calculateZodiacSign } = require('../utils/ZodiacCalculator');


async function bulkUpdateZodiacSigns() {
  try {
    console.log('Starting bulk zodiac sign migration...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/horoscope-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const usersWithoutZodiac = await User.find({
      $or: [
        { zodiacSign: { $exists: false } },
        { zodiacSign: null },
        { zodiacSign: '' },
        { zodiacSign: 'Unknown' }
      ]
    }).select('_id birthdate email');

    console.log(`📊 Found ${usersWithoutZodiac.length} users to update`);

    if (usersWithoutZodiac.length === 0) {
      console.log('✨ All users already have zodiac signs!');
      process.exit(0);
    }

    const bulkOps = [];
    const skippedUsers = [];

    for (const user of usersWithoutZodiac) {
      if (!user.birthdate) {
        skippedUsers.push(`${user.email}: No birthdate`);
        continue;
      }

      const zodiacSign = calculateZodiacSign(user.birthdate);
      
      if (!zodiacSign || zodiacSign === 'Unknown') {
        skippedUsers.push(`${user.email}: Could not calculate zodiac`);
        continue;
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { zodiacSign } }
        }
      });
    }

    console.log(`📝 Prepared ${bulkOps.length} bulk operations`);

    if (bulkOps.length > 0) {
      const result = await User.bulkWrite(bulkOps);
      
      console.log('\nBulk Update Results:');
      console.log(`Modified: ${result.modifiedCount} users`);
      console.log(`Matched: ${result.matchedCount} users`);
      console.log(`Skipped: ${skippedUsers.length} users`);
      
      if (skippedUsers.length > 0) {
        console.log('\nSkipped Users:');
        skippedUsers.forEach(user => console.log(`   - ${user}`));
      }
    }

    console.log('\nBulk migration completed!');
    
  } catch (error) {
    console.error('Bulk migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

if (require.main === module) {
  bulkUpdateZodiacSigns();
}

module.exports = { bulkUpdateZodiacSigns };