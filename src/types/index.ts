export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice?: number; // For negotiable items
  isNegotiable: boolean;
  image: string;
  images?: string[]; // Multiple images
  location: string;
  sellerName: string;
  sellerId: string;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  createdAt: Date;
  status: 'active' | 'sold' | 'hidden';
  views: number;
  likes: number;
  tags?: string[];
  flashSaleEnd?: Date; // For flash sale items
  availableQuantity?: number; // Available stock
  maxQuantityPerOrder?: number; // Max quantity per single order
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  bio?: string;
  location: string;
  pickupAddress?: string; // Specific pickup location for sellers
  paymentInfo?: string;
  role: 'buyer' | 'seller' | 'admin';
  isVerified: boolean;
  rating: number;
  totalSales?: number;
  totalPurchases?: number;
  joinedAt: Date;
  lastActive: Date;
  preferences?: {
    notifications: boolean;
    darkMode: boolean;
    language: 'en' | 'yo' | 'ig' | 'ha';
  };
}

export interface HaggleMessage {
  id: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  offerPrice?: number;
  isFromBuyer: boolean;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
}

export interface Sale {
  id: string;
  listingId: string;
  listing: Listing;
  buyerId: string;
  sellerId: string;
  finalPrice: number;
  quantity: number;
  paymentMethod: 'cash' | 'transfer' | 'crypto';
  status: 'pending' | 'paid' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  createdAt: Date;
  completedAt?: Date;
  deliveryAddress?: string;
  deliveryOption: 'pickup' | 'delivery';
  deliveryFee: number;
  trackingInfo?: string;
}

export interface BulletinPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
  isActive: boolean;
  isPinned: boolean;
  category: 'announcement' | 'safety' | 'feature' | 'community';
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  saleId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'sale' | 'review' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface CartItem extends Listing {
  quantity: number;
  negotiatedPrice?: number;
  holdExpiry: Date;
}