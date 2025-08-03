/**
 * Mock horoscope data for each zodiac sign
 */
const horoscopeTemplates = {
    Aries: [
        "Today is a perfect day to take charge of your goals. Your natural leadership will guide you to success.",
        "Your fiery energy is particularly strong today. Channel it into productive activities and watch magic happen.",
        "A new opportunity may present itself. Trust your instincts and don't hesitate to take the first step."
    ],
    Taurus: [
        "Patience will be your greatest asset today. Take time to appreciate the simple pleasures in life.",
        "Your practical nature will help you solve a persistent problem. Trust in your methodical approach.",
        "Focus on building stability in your relationships and finances. Small steps lead to big changes."
    ],
    Gemini: [
        "Your curiosity will lead you to interesting discoveries today. Keep an open mind to new possibilities.",
        "Communication is key today. Reach out to someone you haven't spoken to in a while.",
        "Your adaptability will be tested, but you'll emerge stronger and wiser from the experience."
    ],
    Cancer: [
        "Trust your intuition today - it's particularly sharp. Your emotional intelligence will guide you well.",
        "Home and family matters may need your attention. Creating harmony in your personal space is important.",
        "Your nurturing nature will be appreciated by someone close to you. Kindness goes a long way."
    ],
    Leo: [
        "Your natural charisma is shining bright today. Use it to inspire and motivate others around you.",
        "Creative endeavors are highly favored. Express yourself boldly and without reservation.",
        "Recognition for past efforts may come your way. Accept praise gracefully and stay humble."
    ],
    Virgo: [
        "Attention to detail will pay off today. Your analytical skills are particularly sharp right now.",
        "Organization and planning will help you tackle a complex project. Break it down into manageable steps.",
        "Your helpful nature will be called upon. Offering practical assistance will strengthen relationships."
    ],
    Libra: [
        "Balance is the key theme for today. Seek harmony in all aspects of your life.",
        "Your diplomatic skills will help resolve a conflict. Approach situations with fairness and grace.",
        "Beauty and aesthetics may play an important role in your day. Trust your artistic sensibilities."
    ],
    Scorpio: [
        "Your intensity and focus will help you uncover hidden truths. Trust your investigative instincts.",
        "Transformation is in the air. Embrace change as an opportunity for growth and renewal.",
        "Your mysterious nature attracts others. Use this magnetic quality to build meaningful connections."
    ],
    Sagittarius: [
        "Adventure calls to you today. Whether physical or intellectual, explore new territories.",
        "Your optimistic outlook will inspire others. Share your enthusiasm and positive energy freely.",
        "Learning something new will broaden your perspective. Stay curious and open to wisdom."
    ],
    Capricorn: [
        "Your disciplined approach will lead to tangible results. Stay committed to your long-term goals.",
        "Responsibility may feel heavy today, but your capability to handle it is unmatched.",
        "Building your reputation through consistent effort will pay dividends in the future."
    ],
    Aquarius: [
        "Your innovative thinking will solve an unusual problem. Don't be afraid to suggest unconventional solutions.",
        "Friendship and community connections are highlighted. Collaborate with like-minded individuals.",
        "Your humanitarian spirit is awakened. Consider how you can contribute to a cause you care about."
    ],
    Pisces: [
        "Your imagination is particularly vivid today. Use it for creative or spiritual pursuits.",
        "Compassion and empathy will guide your interactions. Your sensitivity is a gift, not a weakness.",
        "Dreams and intuition hold important messages. Pay attention to subtle signs and synchronicities."
    ]
};

/**
 * Generate a random horoscope for a given zodiac sign
 * @param {string} zodiacSign - The zodiac sign
 * @returns {string} - Generated horoscope
*/

function generateHoroscope(zodiacSign) {
    const templates = horoscopeTemplates[zodiacSign];
    if (!templates) {
        return "The stars are mysterious today. Trust your inner wisdom to guide you.";
    }

    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
}

module.exports = { generateHoroscope };