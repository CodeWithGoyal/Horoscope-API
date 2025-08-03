const express = require('express');
const auth = require('../middleware/auth');
const HoroscopeHistory = require('../models/HoroscopeHistory');
const { generateHoroscope } = require('../utils/horoscopeGenerator');

const router = express.Router();

router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    let horoscopeRecord = await HoroscopeHistory.findOne({
      userId: req.user._id,
      date: today
    });

    let horoscopeContent;

    if (horoscopeRecord) {
      horoscopeContent = horoscopeRecord.content;
    } else {
      horoscopeContent = generateHoroscope(req.user.zodiacSign);
      
      horoscopeRecord = new HoroscopeHistory({
        userId: req.user._id,
        zodiacSign: req.user.zodiacSign,
        content: horoscopeContent,
        date: today
      });
      
      await horoscopeRecord.save();
    }

    res.json({
      zodiacSign: req.user.zodiacSign,
      date: today.toISOString().split('T')[0],
      horoscope: horoscopeContent
    });
  } catch (error) {
    console.error('Today horoscope error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const history = await HoroscopeHistory.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo }
    })
    .sort({ date: -1 })
    .select('date content');

    const formattedHistory = history.map(record => ({
      date: record.date.toISOString().split('T')[0],
      horoscope: record.content
    }));

    res.json({
      zodiacSign: req.user.zodiacSign,
      history: formattedHistory
    });
  } catch (error) {
    console.error('Horoscope history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;