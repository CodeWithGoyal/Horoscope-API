const mongoose = require('mongoose');

const horoscopeHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  zodiacSign: {
    type: String,
    required: true,
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

horoscopeHistorySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HoroscopeHistory', horoscopeHistorySchema);