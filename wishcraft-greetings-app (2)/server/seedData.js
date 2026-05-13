const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const User = require('./models/User');
const Template = require('./models/Template');
const connectDB = require('./config/db');

const templates = [
  { title: 'Ishq-e-Dil', category: 'Shayari', backgroundImage: 'https://picsum.photos/seed/shayari1/800/1000', quoteText: 'क्या हिसाब दूँ तुम्हें अपनी चाहत का\nआज टटोला अपनी साँसों को\nतो हर साँस के फासलों में तुम्हें पाया', isPremium: false, tags: ['love', 'romantic'], trending: true },
  { title: 'Dard-e-Mohabbat', category: 'Shayari', backgroundImage: 'https://picsum.photos/seed/shayari2/800/1000', quoteText: 'तू पास हो या दूर, फर्क नहीं पड़ता\nतेरा ख्याल ही मेरे चेहरे पर मुस्कान ला देता है', isPremium: false, tags: ['love', 'smile'], trending: true },
  { title: 'Raat Ki Tanhai', category: 'Shayari', backgroundImage: 'https://picsum.photos/seed/shayari3/800/1000', quoteText: 'रात की तन्हाई में जब सब सो जाते हैं\nमेरी आँखें तुझे ढूंढती रहती हैं', isPremium: true, tags: ['night', 'longing'] },
  { title: 'Zindagi Ka Safar', category: 'Shayari', backgroundImage: 'https://picsum.photos/seed/shayari4/800/1000', quoteText: 'ज़िंदगी का सफर है ये कैसा सफर\nकोई समझा नहीं, कोई जाना नहीं', isPremium: false, tags: ['life', 'journey'] },
  { title: 'Dosti Ki Misal', category: 'Friendship', backgroundImage: 'https://picsum.photos/seed/friend1/800/1000', quoteText: 'दोस्ती वो नहीं जो साथ दे सुख में\nदोस्ती वो है जो ना छोड़े कभी', isPremium: true, tags: ['friendship', 'loyal'] },
  { title: 'Happy Birthday Wishes', category: 'Birthday', backgroundImage: 'https://picsum.photos/seed/bday1/800/1000', quoteText: 'Happy Birthday! May your day be filled with joy, laughter, and countless blessings.', isPremium: false, tags: ['birthday', 'wishes'], trending: true },
  { title: 'Birthday Celebration', category: 'Birthday', backgroundImage: 'https://picsum.photos/seed/bday2/800/1000', quoteText: 'Another year older, another year wiser. Celebrate your special day!', isPremium: false, tags: ['birthday', 'celebration'] },
  { title: 'Premium Birthday Card', category: 'Birthday', backgroundImage: 'https://picsum.photos/seed/bday3/800/1000', quoteText: 'Wishing you a year ahead filled with success, love, and happiness.', isPremium: true, tags: ['birthday', 'premium'] },
  { title: 'Golden Birthday', category: 'Birthday', backgroundImage: 'https://picsum.photos/seed/bday4/800/1000', quoteText: 'May this birthday bring you golden moments and cherished memories.', isPremium: false, tags: ['birthday', 'golden'] },
  { title: 'Happy Anniversary', category: 'Anniversary', backgroundImage: 'https://picsum.photos/seed/anniv1/800/1000', quoteText: 'Together is a wonderful place to be. Happy Anniversary!', isPremium: false, tags: ['anniversary', 'love'] },
  { title: 'Years of Togetherness', category: 'Anniversary', backgroundImage: 'https://picsum.photos/seed/anniv2/800/1000', quoteText: 'Cheers to the love that grows stronger with each passing year.', isPremium: true, tags: ['anniversary', 'together'] },
  { title: 'Forever Love', category: 'Anniversary', backgroundImage: 'https://picsum.photos/seed/anniv3/800/1000', quoteText: 'In your arms is where I belong. Happy Anniversary, my love.', isPremium: false, tags: ['anniversary', 'romantic'] },
  { title: 'Diwali Wishes', category: 'Festivals', backgroundImage: 'https://picsum.photos/seed/fest1/800/1000', quoteText: 'May the festival of lights illuminate your life with joy and prosperity.', isPremium: false, tags: ['diwali', 'festival'], trending: true },
  { title: 'Eid Mubarak', category: 'Festivals', backgroundImage: 'https://picsum.photos/seed/fest2/800/1000', quoteText: 'Eid Mubarak! May Allah bless you with happiness and peace.', isPremium: false, tags: ['eid', 'festival'] },
  { title: 'Premium Festival Card', category: 'Festivals', backgroundImage: 'https://picsum.photos/seed/fest3/800/1000', quoteText: 'Wishing you and your family a joyous celebration filled with love.', isPremium: true, tags: ['festival', 'family'] },
  { title: 'Holi Hai!', category: 'Festivals', backgroundImage: 'https://picsum.photos/seed/fest4/800/1000', quoteText: 'Let the colors of Holi spread the message of peace and happiness.', isPremium: false, tags: ['holi', 'colors'] },
  { title: 'Funny Wishes', category: 'Joke', backgroundImage: 'https://picsum.photos/seed/joke1/800/1000', quoteText: 'I was going to write you a funny wish... but then I remembered you already have me!', isPremium: false, tags: ['funny', 'humor'] },
  { title: 'Premium Comedy', category: 'Joke', backgroundImage: 'https://picsum.photos/seed/joke2/800/1000', quoteText: 'Age is just a number... but in your case, it is a really big number!', isPremium: true, tags: ['funny', 'age'] },
  { title: 'Wisdom of Life', category: 'Motivation', backgroundImage: 'https://picsum.photos/seed/updesh1/800/1000', quoteText: 'The only way to do great work is to love what you do. — Steve Jobs', isPremium: false, tags: ['wisdom', 'inspiration'] },
  { title: 'Spiritual Guidance', category: 'Motivation', backgroundImage: 'https://picsum.photos/seed/updesh2/800/1000', quoteText: 'Peace comes from within. Do not seek it without. — Buddha', isPremium: false, tags: ['peace', 'spiritual'] },
  { title: 'True Love', category: 'Love', backgroundImage: 'https://picsum.photos/seed/love1/800/1000', quoteText: 'True love stories never have endings.', isPremium: false, tags: ['love', 'romantic'], trending: true },
  { title: 'Heartfelt Love', category: 'Love', backgroundImage: 'https://picsum.photos/seed/love2/800/1000', quoteText: 'You are my today and all of my tomorrows.', isPremium: true, tags: ['love', 'forever'] },
  { title: 'Best Friends', category: 'Friendship', backgroundImage: 'https://picsum.photos/seed/friend2/800/1000', quoteText: 'A true friend is the greatest of all blessings.', isPremium: false, tags: ['friendship', 'blessing'] },
  { title: 'Morning Motivation', category: 'Motivation', backgroundImage: 'https://picsum.photos/seed/motiv1/800/1000', quoteText: 'Every morning is a fresh start. Make it count!', isPremium: false, tags: ['morning', 'fresh'] },
  { title: 'Never Give Up', category: 'Motivation', backgroundImage: 'https://picsum.photos/seed/motiv2/800/1000', quoteText: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', isPremium: true, tags: ['success', 'courage'] }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Template.deleteMany();
    await User.deleteMany({ isAdmin: true });

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@wishcraft.com',
      password: hashedPassword,
      isAdmin: true
    });
    console.log('Admin user created: admin@wishcraft.com / admin123');

    await Template.insertMany(templates);
    console.log('25 templates seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
