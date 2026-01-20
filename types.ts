
export type PageType = 'home' | 'shop' | 'studio' | 'track' | 'admin' | 'support';
export type GarmentType = 'tshirt' | 'hoodie';
export type ViewType = 'front' | 'back';
export type Language = 'en' | 'fr';

export interface User {
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  joinedDate?: string;
}

export interface AdminSettings {
  email: string;
  password?: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  supportEmail: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  type: GarmentType;
  image?: string;
  backImage?: string;
  stock: number;
  availableSizes: Size[];
}

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface AIDesignSuggestion {
  text: string;
  imagePrompt: string;
  fontName: string;
  themeDescription: string;
}

export interface DesignData {
  image: string | null;
  imageScale: number;
  imageRotation: number;
  imagePosition: { x: number; y: number };
  text: string;
  textScale: number;
  textRotation: number;
  textPosition: { x: number; y: number };
  textColor: string;
  textFont: string;
}

export interface CustomizationState {
  garmentType: GarmentType;
  color: ProductColor;
  size: Size;
  view: ViewType;
  frontDesign: DesignData;
  backDesign: DesignData;
  baseImageFront?: string | null;
  baseImageBack?: string | null;
}

export interface CartItem extends CustomizationState {
  id: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  userId: string;
  items: CartItem[];
  shipping: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  paymentMethod: 'card' | 'cod';
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
}

export const COLORS: ProductColor[] = [
  { name: 'Classic White', hex: '#FFFFFF' },
  { name: 'Jet Black', hex: '#121212' },
  { name: 'Ash Gray', hex: '#D1D5DB' },
  { name: 'Deep Navy', hex: '#1E293B' },
  { name: 'Forest', hex: '#14532D' },
  { name: 'Burgundy', hex: '#7F1D1D' },
];

export const SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const FONTS = [
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
  { name: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Oswald', value: "'Oswald', sans-serif" },
  { name: 'Pacifico', value: "'Pacifico', cursive" },
  { name: 'Righteous', value: "'Righteous', cursive" },
  { name: 'Permanent Marker', value: "'Permanent Marker', cursive" },
  { name: 'Bangers', value: "'Bangers', system-ui" },
  { name: 'Abril Fatface', value: "'Abril Fatface', serif" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Cinzel', value: "'Cinzel', serif" },
  { name: 'Unifraktur', value: "'UnifrakturMaguntia', cursive" },
  { name: 'Monospace', value: 'monospace' },
];

export const INITIAL_DESIGN: DesignData = {
  image: null,
  imageScale: 0.5,
  imageRotation: 0,
  imagePosition: { x: 50, y: 35 },
  text: '',
  textScale: 1,
  textRotation: 0,
  textPosition: { x: 50, y: 55 },
  textColor: '#000000',
  textFont: FONTS[1].value,
};
