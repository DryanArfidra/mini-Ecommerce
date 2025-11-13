export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
  discount?: number;
}

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Samsung Z fold 5',
    price: 22999000,
    category: 'Elektronik',
    image: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-172269721/samsung_samsung_galaxy_z_fold6_-12-512gb-_-_smartphone_ai-_smartphone_lipat-_android-_kamera_50mp-_layar_besar_-_proteksi_1_tahun_samsung_care-_full03_b1w9l9fz.jpg',
    description: 'Smartphone canggih dengan fitur terbaru',
    isNew: true,
    isPopular: true,
    discount: 10
  },
  {
    id: '2',
    name: 'T-Shirt Casual',
    price: 149000,
    category: 'Fashion',
    image: 'https://images.othoba.com/images/thumbs/1215733_premium-mens-drop-shoulder-t-shirt-high-quality-cotton-unique-graphic-design-comfortable-casual-wear.jpeg',
    description: 'Kaos casual nyaman untuk sehari-hari',
    isPopular: true
  },
  {
    id: '3',
    name: 'Lataio Special',
    price: 25000,
    category: 'Food',
    image: 'https://images-cdn.ubuy.co.id/64806eef1c28c34825760bc2-latiao-snack-gift-package65gbag-spicy.jpg',
    description: 'Snack enak untuk teman bersantai'
  },
  {
    id: '4',
    name: 'Beringin Toys',
    price: 189000,
    category: 'Baby Gear',
    image: 'https://beringin.toys/wp-content/uploads/2023/03/QH03-COLORFUL-WOODEN-STACKING-RING-TOWER-01-1.jpg',
    description: 'Mainan edukasi untuk anak'
  },
  {
    id: '5',
    name: 'Oli Mobil Sintetik',
    price: 85000,
    category: 'Automotive',
    image: 'https://www.mobil.co.id/-/media/project/wep/mobil/mobil-id/product-media/mobil-super-moto-matic-10w-40/mobil-super-moto-matic-10w-40-08-liter-fs-square-md.jpg',
    description: 'Oli mobil sintetik terbaik'
  },
  {
    id: '6',
    name: 'Laptop Gaming RTX',
    price: 15999000,
    category: 'Elektronik',
    image: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/101/MTA-144519581/nvidia_laptop_gaming_axioo_pongo_960_geforce_rtx_4060_i9-13900h_full01_ffkqru6l.jpg',
    description: 'Laptop gaming dengan GPU RTX',
    isNew: true,
    discount: 15
  },
  {
    id: '7',
    name: 'Sepatu Running',
    price: 349000,
    category: 'Fashion',
    image: 'https://img.lazcdn.com/g/p/ccb2a53da4f70a610bdb8bec6217051f.jpg_720x720q80.jpg',
    description: 'Sepatu running nyaman untuk olahraga',
    isPopular: true
  },
  {
    id: '8',
    name: 'Kopi Arabika Premium',
    price: 75000,
    category: 'Food',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTFQTdrVlV4LKe3HZmHOutP320d5DQ25j3Vg&s',
    description: 'Kopi arabika kualitas premium'
  },
  {
    id: '9',
    name: 'Stroller Bayi',
    price: 899000,
    category: 'Baby Gear',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVQK0hS88U8frtS_3XJ84g_YTdJSe3Cm_t8A&s',
    description: 'Stroller bayi dengan fitur keamanan',
    discount: 20
  },
  {
    id: '10',
    name: 'Ban Mobil All Season',
    price: 650000,
    category: 'Automotive',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlMwX4ffMcFY7vClMtOB9bdwrj97wo9pRN1g&s',
    description: 'Ban mobil all season tahan lama'
  },
  {
    id: '11',
    name: 'Headphone Wireless',
    price: 449000,
    category: 'Elektronik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX-1i-6dMnxnip5uoLXx1ZQQYUeBroXXeQDQ&s',
    description: 'Headphone wireless dengan noise cancellation',
    isNew: true,
    isPopular: true
  },
  {
    id: '12',
    name: 'Jaket Hoodie',
    price: 229000,
    category: 'Fashion',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvbJoJqPJbno_5b1gEMecwJj5lTGyeAZO1Pg&s',
    description: 'Jaket hoodie stylish dan nyaman'
  },
  {
    id: '13',
    name: 'Kratingdaeng',
    price: 15000,
    category: 'Food',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHKft8_IjqHUBELoPyMmoRRvPINjv0cqTi8w&s',
    description: 'Minuman energi untuk aktifitas'
  },
  {
    id: '14',
    name: 'Popok Bayi',
    price: 89000,
    category: 'Baby Gear',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrBBL9dnEGt5pdS9YYQ6nALuHT28DTR0qROg&s',
    description: 'Popok bayi dengan daya serap tinggi'
  },
  {
    id: '15',
    name: 'Aki Mobil',
    price: 450000,
    category: 'Automotive',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjjjeWTBaFY2TB-JIppv9dOFKC3jhJmCClzg&s',
    description: 'Aki mobil tahan lama',
    discount: 5
  },
  {
    id: '16',
    name: 'Smartband 8',
    price: 799000,
    category: 'Elektronik',
    image: 'https://i02.appmifile.com/338_item_id/07/11/2024/325f4448c863c1840a5f86aa9c14334e.png?thumb=1&q=85',
    description: 'Smart watch dengan fitur kesehatan',
    isNew: true
  },
  {
    id: '17',
    name: 'Celana Jeans',
    price: 279000,
    category: 'Fashion',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnwiOh7Azq6uRam5wsew68ehHaGccDcaMKcg&s',
    description: 'Celana jeans bahan premium',
    isPopular: true
  },
  {
    id: '18',
    name: 'Biskuit Gandum',
    price: 32000,
    category: 'Food',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR39v2JAkxLJ5zAkH3pSMpPC67nF5POFGJayw&s',
    description: 'Biskuit gandum sehat'
  },
  {
    id: '19',
    name: 'Botol Susu Bayi',
    price: 45000,
    category: 'Baby Gear',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSILjurtz0Vt58A2t37HrTuHmsPuhdZNcGUg&s',
    description: 'Botol susu bayi BPA free'
  },
  {
    id: '20',
    name: 'Kampas Rem',
    price: 120000,
    category: 'Automotive',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwctCpEPLD_0IudxuyNmZAuOTD9cG8C_V9lQ&s',
    description: 'Kampas rem mobil original'
  }
];