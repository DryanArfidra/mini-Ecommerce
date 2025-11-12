import { Product } from '../types/types';

// Pastikan tipe Product di src/types/index.ts sudah diperbarui seperti ini:
// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   description: string;
//   category: string;
//   isPopular: boolean;
//   discountPercentage: number; // 0 jika tidak ada diskon
// }

export const initialProducts: Product[] = [
  // --- Elektronik ---
  {
    id: '1',
    name: 'Laptop Gaming Pro',
    price: 15000000,
    imageUrl: 'https://picsum.photos/seed/laptop1/300/200.jpg',
    description: 'Laptop dengan performa tinggi untuk gaming dan produktivitas.',
    category: 'Elektronik',
    isPopular: true,
    discountPercentage: 0,
  },
  {
    id: '2',
    name: 'Smartphone X',
    price: 8000000,
    imageUrl: 'https://picsum.photos/seed/phone1/300/200.jpg',
    description: 'Smartphone flagship dengan kamera terbaik di kelasnya.',
    category: 'Elektronik',
    isPopular: true,
    discountPercentage: 10,
  },
  {
    id: '3',
    name: 'Headphone Wireless',
    price: 1200000,
    imageUrl: 'https://picsum.photos/seed/headphone1/300/200.jpg',
    description: 'Headphone nyaman dengan noise cancelling.',
    category: 'Elektronik',
    isPopular: false,
    discountPercentage: 15,
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 1500000,
    imageUrl: 'https://picsum.photos/seed/keyboard1/300/200.jpg',
    description: 'Keyboard mekanik dengan backlight RGB yang memukau.',
    category: 'Elektronik',
    isPopular: false,
    discountPercentage: 0,
  },
  // --- Fashion ---
  {
    id: '5',
    name: 'Kemeja Flanel',
    price: 350000,
    imageUrl: 'https://picsum.photos/seed/shirt1/300/200.jpg',
    description: 'Kemeja flanel nyaman untuk gaya kasual.',
    category: 'Pakaian',
    isPopular: false,
    discountPercentage: 20,
  },
  {
    id: '6',
    name: 'Sepatu Sneakers',
    price: 750000,
    imageUrl: 'https://picsum.photos/seed/shoes1/300/200.jpg',
    description: 'Sneakers stylish dan nyaman untuk sehari-hari.',
    category: 'Pakaian',
    isPopular: true,
    discountPercentage: 0,
  },
  {
    id: '7',
    name: 'Tas Ransel',
    price: 450000,
    imageUrl: 'https://picsum.photos/seed/backpack1/300/200.jpg',
    description: 'Tas ransel dengan banyak kompartemen.',
    category: 'Pakaian',
    isPopular: false,
    discountPercentage: 0,
  },
  // --- Makanan ---
  {
    id: '8',
    name: 'Kopi Arabica 1kg',
    price: 150000,
    imageUrl: 'https://picsum.photos/seed/coffee1/300/200.jpg',
    description: 'Biji kopi arabica pilihan dengan rasa yang kaya.',
    category: 'Makanan',
    isPopular: false,
    discountPercentage: 5,
  },
  {
    id: '9',
    name: 'Cokelat Premium',
    price: 85000,
    imageUrl: 'https://picsum.photos/seed/chocolate1/300/200.jpg',
    description: 'Cokelat premium dengan kualitas terbaik.',
    category: 'Makanan',
    isPopular: true,
    discountPercentage: 0,
  },
  // --- Otomotif ---
  {
    id: '10',
    name: 'Helm Full Face',
    price: 1200000,
    imageUrl: 'https://picsum.photos/seed/helmet1/300/200.jpg',
    description: 'Helm full face dengan sertifikasi standar internasional.',
    category: 'Otomotif',
    isPopular: false,
    discountPercentage: 0,
  },
  {
    id: '11',
    name: 'Jas Hujan Motor',
    price: 250000,
    imageUrl: 'https://picsum.photos/seed/raincoat1/300/200.jpg',
    description: 'Jas hujan motor yang anti air dan nyaman.',
    category: 'Otomotif',
    isPopular: false,
    discountPercentage: 30,
  },
  // --- Hiburan ---
  {
    id: '12',
    name: 'Gitar Akustik',
    price: 1800000,
    imageUrl: 'https://picsum.photos/seed/guitar1/300/200.jpg',
    description: 'Gitar akustik dengan suara yang jernih.',
    category: 'Hiburan',
    isPopular: true,
    discountPercentage: 0,
  },
  // --- Perlengkapan Bayi ---
  {
    id: '13',
    name: 'Stroller Bayi',
    price: 2200000,
    imageUrl: 'https://picsum.photos/seed/stroller1/300/200.jpg',
    description: 'Stroller ringan dan mudah dilipat.',
    category: 'Perlengkapan Bayi',
    isPopular: false,
    discountPercentage: 0,
  },
  {
    id: '14',
    name: 'Mainan Edukatif',
    price: 350000,
    imageUrl: 'https://picsum.photos/seed/toy1/300/200.jpg',
    description: 'Mainan edukatif untuk mengasah otak anak.',
    category: 'Perlengkapan Bayi',
    isPopular: true,
    discountPercentage: 10,
  },
];