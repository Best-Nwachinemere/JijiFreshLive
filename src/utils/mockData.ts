import { Listing, User, Sale, BulletinPost, Review, Notification, HaggleMessage } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Adunni Okafor',
    email: 'adunni@example.com',
    phone: '+234 803 123 4567',
    profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Fresh produce seller with 5+ years experience. Quality guaranteed! I source directly from farms in Akwa Ibom State.',
    location: 'Uyo, Akwa Ibom',
    pickupAddress: 'Shop 15, Uyo Main Market, Ikot Ekpene Road, Uyo',
    role: 'seller',
    isVerified: true,
    rating: 4.8,
    totalSales: 156,
    joinedAt: new Date('2023-01-15'),
    lastActive: new Date(),
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en'
    }
  },
  {
    id: '2',
    name: 'Chinedu Okoro',
    email: 'chinedu@example.com',
    phone: '+234 807 987 6543',
    profilePhoto: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Electronics and gadgets specialist. Best prices in Akwa Ibom! Authorized dealer for major brands.',
    location: 'Eket, Akwa Ibom',
    pickupAddress: 'Chinedu Electronics, Plot 45 Eket-Oron Road, Eket',
    role: 'seller',
    isVerified: true,
    rating: 4.9,
    totalSales: 89,
    joinedAt: new Date('2023-03-20'),
    lastActive: new Date(),
    preferences: {
      notifications: true,
      darkMode: true,
      language: 'en'
    }
  },
  {
    id: '3',
    name: 'Fatima Musa',
    email: 'fatima@example.com',
    phone: '+234 809 555 0123',
    role: 'admin',
    location: 'Uyo, Akwa Ibom',
    isVerified: true,
    rating: 5.0,
    joinedAt: new Date('2022-12-01'),
    lastActive: new Date(),
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en'
    }
  },
  {
    id: '4',
    name: 'Kemi Adebayo',
    email: 'kemi@example.com',
    phone: '+234 805 111 2222',
    profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Fashion enthusiast and boutique owner. Trendy clothes at affordable prices!',
    location: 'Ikot Ekpene, Akwa Ibom',
    pickupAddress: 'Kemi Fashion House, 23 Market Road, Ikot Ekpene',
    role: 'seller',
    isVerified: true,
    rating: 4.7,
    totalSales: 234,
    joinedAt: new Date('2023-05-10'),
    lastActive: new Date(),
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'yo'
    }
  },
  {
    id: '5',
    name: 'Ibrahim Hassan',
    email: 'ibrahim@example.com',
    phone: '+234 806 333 4444',
    role: 'buyer',
    location: 'Oron, Akwa Ibom',
    isVerified: false,
    rating: 4.5,
    totalPurchases: 12,
    joinedAt: new Date('2024-01-05'),
    lastActive: new Date(),
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'ha'
    }
  }
];

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Fresh Tomatoes - Premium Quality',
    description: 'Farm-fresh tomatoes harvested this morning from our organic farm in Akwa Ibom State. Perfect for cooking, salads, and stews. No chemicals or pesticides used. These tomatoes are rich in vitamins and have that authentic farm taste you remember.',
    price: 500,
    minPrice: 400,
    isNegotiable: true,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    images: [
      'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    location: 'Uyo, Akwa Ibom',
    sellerName: 'Adunni Okafor',
    sellerId: '1',
    category: 'Fresh Produce',
    condition: 'new',
    createdAt: new Date('2024-01-20'),
    status: 'active',
    views: 45,
    likes: 12,
    tags: ['organic', 'fresh', 'farm-direct', 'no-chemicals'],
    flashSaleEnd: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    availableQuantity: 50,
    maxQuantityPerOrder: 10
  },
  {
    id: '2',
    title: 'iPhone 13 - Excellent Condition',
    description: '128GB iPhone 13 in pristine condition. Includes original charger, box, and unused EarPods. Battery health 95%. No scratches or dents. Perfect for someone looking for a premium phone at a great price.',
    price: 450000,
    minPrice: 420000,
    isNegotiable: true,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    location: 'Eket, Akwa Ibom',
    sellerName: 'Chinedu Okoro',
    sellerId: '2',
    category: 'Electronics',
    condition: 'used',
    createdAt: new Date('2024-01-19'),
    status: 'active',
    views: 128,
    likes: 23,
    tags: ['apple', 'smartphone', 'premium', 'original'],
    availableQuantity: 5,
    maxQuantityPerOrder: 2
  },
  {
    id: '3',
    title: 'Organic Pepper - Scotch Bonnet',
    description: 'Spicy scotch bonnet peppers grown organically in our greenhouse in Akwa Ibom. Perfect for stews, pepper soup, and traditional Nigerian dishes. These peppers pack serious heat and authentic flavor.',
    price: 200,
    isNegotiable: false,
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Uyo, Akwa Ibom',
    sellerName: 'Adunni Okafor',
    sellerId: '1',
    category: 'Fresh Produce',
    condition: 'new',
    createdAt: new Date('2024-01-18'),
    status: 'active',
    views: 67,
    likes: 8,
    tags: ['organic', 'spicy', 'fresh', 'local'],
    flashSaleEnd: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    availableQuantity: 100,
    maxQuantityPerOrder: 20
  },
  {
    id: '4',
    title: 'Samsung Galaxy Buds Pro',
    description: 'Brand new Samsung Galaxy Buds Pro with active noise cancellation. Sealed box with all accessories. Perfect for music lovers and professionals who need quality audio.',
    price: 85000,
    minPrice: 75000,
    isNegotiable: true,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Eket, Akwa Ibom',
    sellerName: 'Chinedu Okoro',
    sellerId: '2',
    category: 'Electronics',
    condition: 'new',
    createdAt: new Date('2024-01-17'),
    status: 'active',
    views: 89,
    likes: 15,
    tags: ['samsung', 'wireless', 'noise-cancelling', 'new'],
    availableQuantity: 12,
    maxQuantityPerOrder: 3
  },
  {
    id: '5',
    title: 'Ankara Dress - Designer Collection',
    description: 'Beautiful handmade Ankara dress in vibrant colors. Size 12-14. Perfect for special occasions, church, or office wear. Made with premium quality Ankara fabric.',
    price: 15000,
    minPrice: 12000,
    isNegotiable: true,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Ikot Ekpene, Akwa Ibom',
    sellerName: 'Kemi Adebayo',
    sellerId: '4',
    category: 'Fashion',
    condition: 'new',
    createdAt: new Date('2024-01-16'),
    status: 'active',
    views: 156,
    likes: 34,
    tags: ['ankara', 'handmade', 'designer', 'african-print'],
    availableQuantity: 8,
    maxQuantityPerOrder: 2
  },
  {
    id: '6',
    title: 'Rice - Premium Ofada Rice',
    description: 'Authentic Ofada rice from local farms in Akwa Ibom State. Unpolished and full of nutrients. Perfect for traditional Nigerian dishes. 5kg bag.',
    price: 3500,
    minPrice: 3000,
    isNegotiable: true,
    image: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Uyo, Akwa Ibom',
    sellerName: 'Adunni Okafor',
    sellerId: '1',
    category: 'Food & Food Items',
    condition: 'new',
    createdAt: new Date('2024-01-15'),
    status: 'active',
    views: 78,
    likes: 19,
    tags: ['ofada', 'rice', 'local', 'nutritious'],
    flashSaleEnd: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    availableQuantity: 25,
    maxQuantityPerOrder: 5
  }
];

export const mockBulletinPosts: BulletinPost[] = [
  {
    id: '1',
    title: 'Welcome to JijiFresh Akwa Ibom!',
    content: 'We are excited to launch our fresh local marketplace in Akwa Ibom State! Buy and sell with confidence knowing every transaction is secure and transparent. Join thousands of Akwa Ibom residents already trading on our platform!',
    author: 'JijiFresh Team',
    authorId: '3',
    createdAt: new Date('2024-01-15'),
    isActive: true,
    isPinned: true,
    category: 'announcement'
  },
  {
    id: '2',
    title: 'Safety Tips for Buyers in Akwa Ibom',
    content: 'Always meet in public places like Uyo Main Market, Eket Central Market, or Ikot Ekpene Market. Inspect items before payment. Report suspicious activities immediately. Use our in-app messaging system for all communications.',
    author: 'Admin',
    authorId: '3',
    createdAt: new Date('2024-01-18'),
    isActive: true,
    isPinned: true,
    category: 'safety'
  },
  {
    id: '3',
    title: 'New Feature: Smart Pricing System',
    content: 'We have introduced our new smart pricing system! Sellers can now set minimum prices for negotiable items, and buyers can make offers. The system automatically validates offers to ensure fair deals for everyone!',
    author: 'Product Team',
    authorId: '3',
    createdAt: new Date('2024-01-20'),
    isActive: true,
    isPinned: false,
    category: 'feature'
  },
  {
    id: '4',
    title: 'Flash Sales Now Available!',
    content: 'Sellers can now create flash sales with countdown timers! Add urgency to your listings and boost sales. Flash sale items appear prominently on the homepage and get priority visibility.',
    author: 'Product Team',
    authorId: '3',
    createdAt: new Date('2024-01-22'),
    isActive: true,
    isPinned: false,
    category: 'feature'
  }
];

export const mockSales: Sale[] = [
  {
    id: '1',
    listingId: '3',
    listing: mockListings[2],
    buyerId: '5',
    sellerId: '1',
    finalPrice: 200,
    quantity: 2,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: new Date('2024-01-21'),
    completedAt: new Date('2024-01-21'),
    deliveryAddress: 'Oron, Akwa Ibom',
    deliveryOption: 'pickup',
    deliveryFee: 0
  },
  {
    id: '2',
    listingId: '4',
    listing: mockListings[3],
    buyerId: '5',
    sellerId: '2',
    finalPrice: 80000,
    quantity: 1,
    paymentMethod: 'transfer',
    status: 'delivered',
    createdAt: new Date('2024-01-20'),
    deliveryAddress: 'Oron, Akwa Ibom',
    deliveryOption: 'delivery',
    deliveryFee: 1000,
    trackingInfo: 'JF-2024-001'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    reviewerId: '5',
    revieweeId: '1',
    saleId: '1',
    rating: 5,
    comment: 'Excellent quality peppers! Very fresh and spicy as described. Fast delivery too.',
    createdAt: new Date('2024-01-22')
  },
  {
    id: '2',
    reviewerId: '5',
    revieweeId: '2',
    saleId: '2',
    rating: 5,
    comment: 'Great seller! Item exactly as described and well packaged. Highly recommended.',
    createdAt: new Date('2024-01-21')
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'sale',
    title: 'New Sale!',
    message: 'Your Scotch Bonnet Peppers have been sold to Ibrahim Hassan',
    isRead: false,
    createdAt: new Date('2024-01-21'),
    actionUrl: '/seller-dashboard'
  },
  {
    id: '2',
    userId: '2',
    type: 'message',
    title: 'New Offer',
    message: 'Someone made an offer on your Samsung Galaxy Buds Pro',
    isRead: true,
    createdAt: new Date('2024-01-20'),
    actionUrl: '/messages'
  }
];

export const mockHaggleMessages: HaggleMessage[] = [
  {
    id: '1',
    listingId: '2',
    senderId: '5',
    receiverId: '2',
    message: 'Hello! Can you do ₦400,000 for the iPhone?',
    offerPrice: 400000,
    isFromBuyer: true,
    timestamp: new Date('2024-01-22T10:30:00'),
    status: 'pending'
  },
  {
    id: '2',
    listingId: '2',
    senderId: '2',
    receiverId: '5',
    message: 'Thanks for your interest! I can do ₦430,000 - it\'s in excellent condition.',
    offerPrice: 430000,
    isFromBuyer: false,
    timestamp: new Date('2024-01-22T11:15:00'),
    status: 'countered'
  }
];

export const haggleMessages = [
  "Add am small thing nau, customer!",
  "Haba nau, this price never reach reach.",
  "If I sell am this price, I go just pack go back my papa village!",
  "Abeg na, do last price.",
  "Wetin be your final? Talk true abeg.",
  "This one no be Lagos price o!",
  "You sef check am na, I dey try for you.",
  "Boss, make we meet halfway na!",
  "I dey beg you, consider am well well.",
  "Na because you be my customer I dey do this price.",
  "My friend, this item na quality o! Check am well.",
  "I fit reduce am small, but no too much o.",
  "This na my final price, I no fit go below am.",
  "You be serious buyer? Make we talk business.",
  "I dey do this price because na you ask."
];

// Akwa Ibom State locations for MVP launch
export const akwaIbomAreas = [
  'Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Abak', 'Etinan', 'Ikot Abasi',
  'Itu', 'Essien Udim', 'Eastern Obolo', 'Ibeno', 'Ibesikpo Asutan',
  'Ibiono Ibom', 'Ika', 'Ikono', 'Ini', 'Mkpat Enin', 'Nsit Atai',
  'Nsit Ibom', 'Nsit Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oruk Anam',
  'Udung Uko', 'Ukanafun', 'Uruan', 'Urue Offong/Oruko'
];

export const nigerianStates = [
  'Akwa Ibom' // MVP focus on Akwa Ibom only
];

export const categories = [
  'Fresh Produce', 'Food & Food Items', 'Electronics', 'Fashion', 'Home & Garden', 'Automotive',
  'Books & Education', 'Sports & Fitness', 'Beauty & Health', 'Baby & Kids',
  'Furniture', 'Appliances', 'Phones & Tablets', 'Computers', 'Services'
];