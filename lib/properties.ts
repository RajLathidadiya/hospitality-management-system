export type Property = {
  slug: string;
  name: string;
  type: 'Hotel' | 'Resort' | 'Villa' | 'Homestay' | 'Event Venue';
  location: string;
  city: string;
  state: string;
  price: number;
  rating: number;
  guests: number;
  featured?: boolean;
  image: string;
  description: string;
  amenities: string[];
  rooms: {
    name: string;
    price: number;
    capacity: number;
    bed: string;
    size: string;
    image: string;
  }[];
};

export const properties: Property[] = [
  {
    slug: 'sawariya-lake-resort',
    name: 'Sawariya Lake Resort',
    type: 'Resort',
    location: 'Udaipur, Rajasthan',
    city: 'Udaipur',
    state: 'Rajasthan',
    price: 4999,
    rating: 4.8,
    guests: 4,
    featured: true,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=85',
    description: 'A relaxed resort stay designed for guests who want comfort, beautiful surroundings and easy access to Udaipur.',
    amenities: ['Swimming Pool', 'WiFi', 'Parking', 'Restaurant', 'Air Conditioning', 'Room Service'],
    rooms: [
      { name: 'Deluxe Room', price: 4999, capacity: 2, bed: 'King Bed', size: '350 sq.ft.', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Family Suite', price: 7499, capacity: 4, bed: 'King + Sofa Bed', size: '520 sq.ft.', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85' },
    ],
  },
  {
    slug: 'sawariya-private-villa',
    name: 'Sawariya Private Villa',
    type: 'Villa',
    location: 'Udaipur, Rajasthan',
    city: 'Udaipur',
    state: 'Rajasthan',
    price: 7500,
    rating: 4.9,
    guests: 8,
    featured: true,
    image: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1400&q=85',
    description: 'A private villa for families and groups looking for space, privacy and a comfortable getaway.',
    amenities: ['Private Pool', 'WiFi', 'Parking', 'Kitchen', 'Air Conditioning', 'Outdoor Area'],
    rooms: [
      { name: 'Premium Bedroom', price: 7500, capacity: 2, bed: 'King Bed', size: '400 sq.ft.', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Family Bedroom', price: 9500, capacity: 4, bed: '2 Double Beds', size: '600 sq.ft.', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85' },
    ],
  },
  {
    slug: 'sawariya-boutique-hotel',
    name: 'Sawariya Boutique Hotel',
    type: 'Hotel',
    location: 'Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    price: 3999,
    rating: 4.7,
    guests: 3,
    featured: true,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=85',
    description: 'A boutique city stay combining contemporary comfort with an easy base for exploring Jaipur.',
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Air Conditioning', 'Breakfast', '24/7 Support'],
    rooms: [
      { name: 'Executive Room', price: 3999, capacity: 2, bed: 'Queen Bed', size: '300 sq.ft.', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Premium Suite', price: 5999, capacity: 3, bed: 'King Bed', size: '430 sq.ft.', image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=85' },
    ],
  },
  {
    slug: 'sawariya-heritage-homestay',
    name: 'Sawariya Heritage Homestay',
    type: 'Homestay',
    location: 'Udaipur, Rajasthan',
    city: 'Udaipur',
    state: 'Rajasthan',
    price: 2999,
    rating: 4.6,
    guests: 4,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
    description: 'A warm homestay experience for travellers who prefer a quieter, more personal stay.',
    amenities: ['WiFi', 'Breakfast', 'Parking', 'Air Conditioning', 'Terrace'],
    rooms: [
      { name: 'Heritage Room', price: 2999, capacity: 2, bed: 'Queen Bed', size: '280 sq.ft.', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1000&q=85' },
    ],
  },
  {
    slug: 'sawariya-celebration-venue',
    name: 'Sawariya Celebration Venue',
    type: 'Event Venue',
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    price: 25000,
    rating: 4.8,
    guests: 300,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85',
    description: 'A flexible celebration venue for weddings, corporate gatherings and private social events.',
    amenities: ['Banquet Hall', 'Catering', 'Decoration', 'Parking', 'Power Backup', 'Event Support'],
    rooms: [],
  },
];

export const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
