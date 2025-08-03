require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function verifyZodiacMigration() {
  try {
    console.log('Verifying zodiac sign migration...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/horoscope-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const totalUsers = await User.countDocuments();
    const usersWithZodiac = await User.countDocuments({
      zodiacSign: { $exists: true, $ne: null, $ne: '', $ne: 'Unknown' }
    });
    const usersWithoutZodiac = await User.countDocuments({
      $or: [
        { zodiacSign: { $exists: false } },
        { zodiacSign: null },
        { zodiacSign: '' },
        { zodiacSign: 'Unknown' }
      ]
    });

    const zodiacDistribution = await User.aggregate([
      { $match: { zodiacSign: { $exists: true, $ne: null, $ne: '', $ne: 'Unknown' } } },
      { $group: { _id: '$zodiacSign', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nMigration Verification Report:');
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Users with Zodiac Signs: ${usersWithZodiac}`);
    console.log(`Users without Zodiac Signs: ${usersWithoutZodiac}`);
    console.log(`Migration Success Rate: ${((usersWithZodiac / totalUsers) * 100).toFixed(2)}%`);

    if (zodiacDistribution.length > 0) {
      console.log('\nZodiac Sign Distribution:');
      zodiacDistribution.forEach(({ _id, count }) => {
        console.log(`   ${_id}: ${count} users`);
      });
    }

    if (usersWithoutZodiac > 0) {
      const problematicUsers = await User.find({
        $or: [
          { zodiacSign: { $exists: false } },
          { zodiacSign: null },
          { zodiacSign: '' },
          { zodiacSign: 'Unknown' }
        ]
      }).select('email birthdate zodiacSign').limit(10);

      console.log('\nUsers still missing zodiac signs (showing first 10):');
      problematicUsers.forEach(user => {
        console.log(`   - ${user.email}: birthdate=${user.birthdate}, zodiac=${user.zodiacSign}`);
      });
    }

    console.log('\nVerification completed!');
    
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

if (require.main === module) {
  verifyZodiacMigration();
}

module.exports = { verifyZodiacMigration };