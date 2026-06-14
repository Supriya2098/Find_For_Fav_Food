import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DISH = {
  biryani: '/images/dishes/biryani.jpg',
  muttonBiryani: '/images/dishes/mutton-biryani.jpg',
  eggBiryani: '/images/dishes/egg-biryani.jpg',
  dosa: '/images/dishes/dosa.jpg',
  ravaDosa: '/images/dishes/rava-dosa.jpg',
  idli: '/images/dishes/idli.jpg',
  miniIdli: '/images/dishes/mini-idli.jpg',
  vada: '/images/dishes/vada.jpg',
  coffee: '/images/dishes/coffee.jpg',
  chicken65: '/images/dishes/chicken65.jpg',
  kebab: '/images/dishes/kebab.jpg',
  haleem: '/images/dishes/haleem.jpg',
  naan: '/images/dishes/naan.jpg',
  curry: '/images/dishes/curry.jpg',
  paneer: '/images/dishes/paneer.jpg',
  dessert: '/images/dishes/dessert.jpg',
  dessert2: '/images/dishes/dessert2.jpg',
  lassi: '/images/dishes/lassi.jpg',
  thali: '/images/dishes/thali.jpg',
  chai: '/images/dishes/chai.jpg',
  shawarma: '/images/dishes/shawarma.jpg',
  sides: '/images/dishes/sides.jpg',
  soda: '/images/dishes/soda.jpg',
  poori: '/images/dishes/poori.jpg',
  upma: '/images/dishes/upma.jpg',
  uttapam: '/images/dishes/uttapam.jpg',
  cutlet: '/images/dishes/cutlet.jpg',
  kesari: '/images/dishes/kesari.jpg',
  biscuit: '/images/dishes/biscuit.jpg',
  pongal: '/images/dishes/pongal.jpg',
  samosa: '/images/dishes/samosa.jpg',
  dalFry: '/images/dishes/dal-fry.jpg',
  pesarattu: '/images/dishes/pesarattu.jpg',
  vegBiryani: '/images/dishes/veg-biryani.jpg',
  dalTadka: '/images/dishes/dal-tadka.jpg',
  paneerButterMasala: '/images/dishes/paneer-butter-masala.jpg',
  gulabJamun: '/images/dishes/gulab-jamun.jpg',
  paneerBiryani: '/images/dishes/paneer-biryani.jpg',
  mirchiKaSalan: '/images/dishes/mirchi-ka-salan.jpg',
  raita: '/images/dishes/raita.jpg',
  qubaniKaMeetha: '/images/dishes/qubani-ka-meetha.jpg',
};

function dish(imageKey, item) {
  return { ...item, imageUrl: DISH[imageKey] };
}

const restaurants = [
  {
    name: 'Paradise Biryani',
    description: 'Iconic Hyderabadi biryani since 1953. Famous for authentic dum biryani, kebabs, and Irani chai.',
    address: 'Paradise Circle, Secunderabad',
    city: 'Hyderabad',
    cuisine: 'Hyderabadi',
    imageUrl: '/images/restaurants/paradise.jpg',
    logoUrl: '/images/logos/paradise.png',
    openingTime: '11:00',
    closingTime: '23:30',
    capacity: 120,
    menuItems: [
      dish('biryani', { name: 'Chicken Dum Biryani', description: 'Legendary Hyderabadi dum biryani with aromatic basmati rice', price: 320, category: 'Biryani' }),
      dish('muttonBiryani', { name: 'Mutton Dum Biryani', description: 'Slow-cooked mutton biryani with saffron and fried onions', price: 420, category: 'Biryani' }),
      dish('paneerBiryani', { name: 'Paneer Biryani', description: 'Fragrant biryani with marinated cottage cheese', price: 280, category: 'Biryani' }),
      dish('chicken65', { name: 'Chicken 65', description: 'Spicy deep-fried chicken with curry leaves and red chilli', price: 290, category: 'Starters' }),
      dish('mirchiKaSalan', { name: 'Mirchi ka Salan', description: 'Hyderabadi green chilli curry in peanut-sesame gravy', price: 90, category: 'Curries' }),
      dish('raita', { name: 'Raita', description: 'Cool yogurt with cucumber, onion, and mint', price: 60, category: 'Sides' }),
      dish('dessert', { name: 'Double Ka Meetha', description: 'Traditional Hyderabadi bread pudding with dry fruits', price: 130, category: 'Desserts' }),
      dish('chai', { name: 'Irani Chai', description: 'Strong spiced tea with creamy milk', price: 40, category: 'Beverages' }),
    ],
  },
  {
    name: 'Chutneys',
    description: 'Popular South Indian restaurant known for dosas, idlis, and authentic filter coffee.',
    address: 'Jubilee Hills, Road No. 36',
    city: 'Hyderabad',
    cuisine: 'South Indian',
    imageUrl: '/images/restaurants/chutneys.jpg',
    logoUrl: 'https://www.chutneysindia.com/wp-content/uploads/2020/06/chutneys-logo.png',
    openingTime: '07:00',
    closingTime: '22:30',
    capacity: 90,
    menuItems: [
      dish('dosa', { name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling', price: 180, category: 'South Indian' }),
      dish('ravaDosa', { name: 'Rava Dosa', description: 'Crispy semolina dosa served with chutney and sambar', price: 170, category: 'South Indian' }),
      dish('pesarattu', { name: 'Pesarattu', description: 'Green moong dal dosa with ginger chutney', price: 160, category: 'South Indian' }),
      dish('idli', { name: 'Idli Sambar (2 pcs)', description: 'Steamed rice cakes with lentil sambar', price: 120, category: 'South Indian' }),
      dish('thali', { name: 'Thali', description: 'Complete meal with roti, curry, and dessert ', price: 220, category: 'Thali & Meals' }),
      dish('vada', { name: 'Medu Vada (2 pcs)', description: 'Crispy lentil donuts with coconut chutney', price: 110, category: 'Starters' }),
      dish('coffee', { name: 'Filter Coffee', description: 'Traditional South Indian decoction coffee', price: 60, category: 'Beverages' }),
      dish('pongal', { name: 'Pongal', description: 'Comforting rice and lentil porridge with ghee', price: 130, category: 'South Indian' }),
    ],
  },
  {
    name: 'Bawarchi RTC X Roads',
    description: 'Hyderabad\'s favourite biryani destination at RTC Cross Roads, loved for bold flavours.',
    address: 'RTC Cross Roads, Musheerabad',
    city: 'Hyderabad',
    cuisine: 'Hyderabadi',
    imageUrl: '/images/restaurants/bawarchi.jpg',
    logoUrl: 'https://www.bawarchihyderabad.com/wp-content/uploads/2020/09/logo.png',
    openingTime: '11:30',
    closingTime: '23:00',
    capacity: 100,
    menuItems: [
      dish('biryani', { name: 'Chicken Biryani', description: 'RTC-style chicken biryani with layered masala rice', price: 300, category: 'Biryani' }),
      dish('muttonBiryani', { name: 'Special Mutton Biryani', description: 'Premium mutton biryani with extra masala', price: 450, category: 'Biryani' }),
      dish('eggBiryani', { name: 'Egg Biryani', description: 'Boiled eggs cooked in spiced biryani rice', price: 220, category: 'Biryani' }),
      dish('chicken65', { name: 'Chicken 65', description: 'Fiery Andhra-style fried chicken starter', price: 280, category: 'Starters' }),
      dish('kebab', { name: 'Kebab Platter', description: 'Assorted seekh and reshmi kebabs', price: 550, category: 'Starters' }),
      dish('dalFry', { name: 'Dal Fry', description: 'Tempered yellow lentils with garlic and cumin', price: 150, category: 'Curries' }),
      dish('naan', { name: 'Butter Naan', description: 'Soft tandoor bread brushed with butter', price: 55, category: 'Breads' }),
      dish('lassi', { name: 'Sweet Lassi', description: 'Chilled yogurt drink with cardamom', price: 80, category: 'Beverages' }),
    ],
  },
  {
    name: 'Pista House',
    description: 'Famous for Haleem, especially during Ramadan, and premium Hyderabadi biryani near Charminar.',
    address: 'Charminar, Old City',
    city: 'Hyderabad',
    cuisine: 'Mughlai',
    imageUrl: '/images/restaurants/pistahouse.jpg',
    logoUrl: '/images/logos/pistahouse.svg',
    openingTime: '10:00',
    closingTime: '23:00',
    capacity: 80,
    menuItems: [
      dish('haleem', { name: 'Mutton Haleem', description: 'Slow-cooked wheat and mutton stew, Pista House signature', price: 280, category: 'Curries' }),
      dish('haleem', { name: 'Chicken Haleem', description: 'Creamy chicken haleem with fried onions and lemon', price: 220, category: 'Curries' }),
      dish('biryani', { name: 'Pista House Biryani', description: 'Aromatic chicken biryani with dry fruits', price: 350, category: 'Biryani' }),
      dish('muttonBiryani', { name: 'Mutton Biryani', description: 'Rich mutton biryani with saffron rice', price: 400, category: 'Biryani' }),
      dish('qubaniKaMeetha', { name: 'Qubani ka Meetha', description: 'Apricot dessert topped with cream and nuts', price: 150, category: 'Desserts' }),
      dish('biscuit', { name: 'Osmania Biscuits', description: 'Famous Hyderabadi tea biscuits (pack of 6)', price: 80, category: 'Desserts' }),
      dish('shawarma', { name: 'Chicken Shawarma Roll', description: 'Juicy chicken wrapped in rumali roti', price: 180, category: 'Starters' }),
      dish('lassi', { name: 'Badam Milk', description: 'Chilled almond milk with saffron', price: 90, category: 'Beverages' }),
    ],
  },
  {
    name: "Ohri's Banjara",
    description: 'Elegant multi-cuisine dining with Andhra thalis, North Indian curries, and banquet-style service.',
    address: 'Banjara Hills, Road No. 12',
    city: 'Hyderabad',
    cuisine: 'Multi-Cuisine',
    imageUrl: '/images/restaurants/ohris.jpg',
    logoUrl: '/images/logos/ohris.png',
    openingTime: '12:00',
    closingTime: '23:00',
    capacity: 150,
    menuItems: [
      dish('thali', { name: 'Andhra Meals', description: 'Unlimited rice, sambar, rasam, curries, and papad', price: 350, category: 'Thali & Meals' }),
      dish('curry', { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 380, category: 'Curries' }),
      dish('paneerButterMasala', { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato-butter gravy', price: 320, category: 'Curries' }),
      dish('vegBiryani', { name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables', price: 260, category: 'Biryani' }),
      dish('naan', { name: 'Garlic Naan', description: 'Tandoor naan topped with garlic and coriander', price: 65, category: 'Breads' }),
      dish('dalTadka', { name: 'Dal Tadka', description: 'Yellow lentils tempered with ghee and spices', price: 220, category: 'Curries' }),
      dish('gulabJamun', { name: 'Gulab Jamun (2 pcs)', description: 'Warm milk dumplings in rose-cardamom syrup', price: 120, category: 'Desserts' }),
      dish('soda', { name: 'Fresh Lime Soda', description: 'Sweet or salted lime soda', price: 70, category: 'Beverages' }),
    ],
  },
  {
    name: 'Minerva Coffee Shop',
    description: 'Heritage South Indian cafe in Himayatnagar, a Hyderabad institution since 1940.',
    address: 'Himayatnagar, SD Road',
    city: 'Hyderabad',
    cuisine: 'South Indian',
    imageUrl: '/images/restaurants/minerva.jpg',
    logoUrl: 'https://www.minervacoffeeshop.com/images/logo.png',
    openingTime: '06:30',
    closingTime: '22:00',
    capacity: 70,
    menuItems: [
      dish('dosa', { name: 'Mysore Masala Dosa', description: 'Crispy dosa with red chutney and potato masala', price: 160, category: 'South Indian' }),
      dish('miniIdli', { name: 'Mini Idli (12 pcs)', description: 'Bite-sized idlis in sambar and chutney', price: 140, category: 'South Indian' }),
      dish('poori', { name: 'Poori Bhaji', description: 'Fluffy pooris with spiced potato curry', price: 150, category: 'South Indian' }),
      dish('upma', { name: 'Upma', description: 'Semolina breakfast with mustard and curry leaves', price: 120, category: 'South Indian' }),
      dish('coffee', { name: 'Filter Coffee', description: 'Strong decoction coffee with frothy milk', price: 55, category: 'Beverages' }),
      dish('uttapam', { name: 'Onion Uttapam', description: 'Thick rice pancake topped with onions', price: 145, category: 'South Indian' }),
      dish('cutlet', { name: 'Veg Cutlet', description: 'Crispy vegetable patties with mint chutney', price: 100, category: 'Starters' }),
      dish('kesari', { name: 'Kesari Bath', description: 'Sweet semolina dessert with ghee and saffron', price: 90, category: 'Desserts' }),
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const supriyaPassword = await bcrypt.hash('Supriya@2003', 10);
  const demoPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'supriyakusuma0905@gmail.com' },
    update: { name: 'Supriya', password: supriyaPassword },
    create: {
      email: 'supriyakusuma0905@gmail.com',
      password: supriyaPassword,
      name: 'Supriya',
      role: 'USER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { password: demoPassword },
    create: {
      email: 'user@example.com',
      password: demoPassword,
      name: 'Demo User',
      role: 'USER',
    },
  });

  for (const data of restaurants) {
    const { menuItems, ...restaurantData } = data;
    const restaurant = await prisma.restaurant.create({ data: restaurantData });

    for (const item of menuItems) {
      await prisma.menuItem.create({
        data: { ...item, restaurantId: restaurant.id },
      });
    }
  }

  console.log('Seed complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
