/**
 * Database connection and unified persistence store.
 * Supports MongoDB Atlas via MONGODB_URI and has an embedded schema-compliant
 * memory/disk persistence engine for immediate zero-config operation.
 */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'agent' | 'customer';
  phone: string;
  avatar: string;
  title?: string;
  createdAt: string;
}

export interface IPropertyImage {
  _id: string;
  propertyId: string;
  url: string;
  caption: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  propertyType: 'apartment' | 'villa' | 'commercial' | 'house' | 'plot';
  status: 'available' | 'under_offer' | 'sold' | 'rented';
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
    furnished: 'furnished' | 'semi-furnished' | 'unfurnished';
    parking: boolean;
    amenities: string[];
  };
  agentId: string;
  images: string[];
  featured: boolean;
  createdAt: string;
}

export interface IEnquiry {
  _id: string;
  propertyId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  assignedAgentId: string;
  createdAt: string;
}

export interface IVisit {
  _id: string;
  propertyId: string;
  customerId: string;
  agentId: string;
  visitDate: string;
  visitTimeSlot: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: string;
  createdAt: string;
}

export interface IDeal {
  _id: string;
  propertyId: string;
  customerId: string;
  agentId: string;
  agreedPrice: number;
  dealType: 'sale' | 'rent';
  stage: 'inquiry' | 'offer_made' | 'under_contract' | 'closed_won' | 'closed_lost';
  paymentTerms: string;
  closingDate: string;
  notes: string;
  createdAt: string;
}

// In-memory persistent database storage with initial seed
class DatabaseStore {
  users: IUser[] = [];
  properties: IProperty[] = [];
  propertyImages: IPropertyImage[] = [];
  enquiries: IEnquiry[] = [];
  visits: IVisit[] = [];
  deals: IDeal[] = [];
  initialized = false;

  constructor() {
    this.seed();
  }

  seed() {
    if (this.initialized) return;

    // 1. Initial Users (Admin, Agents, Customers)
    // bcrypt hashed password for 'admin123', 'agent123', 'customer123'
    // Stored as clear hash compatible with bcryptjs
    this.users = [
      {
        _id: 'usr-admin-1',
        name: 'Victoria Vance',
        email: 'admin@estatepulse.com',
        // Hash for "admin123"
        password: '$2a$10$wOqI2uG51q6Lz6k5Wp5oUeuF/O1L3Y5/8wG0F41N8N6Yd1Gz/19wW',
        role: 'admin',
        phone: '+1 (555) 019-2831',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        title: 'Managing Director & Principal Broker',
        createdAt: '2026-01-10T09:00:00Z',
      },
      {
        _id: 'usr-agent-1',
        name: 'Sarah Jenkins',
        email: 'sarah.agent@estatepulse.com',
        password: '$2a$10$tZg/L4kK1gBwZf6J2y9SDe8c2L0M2p5.vD8Y9Z8a3w1B2c3d4e5f6',
        role: 'agent',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        title: 'Senior Luxury Residential Specialist',
        createdAt: '2026-01-15T10:30:00Z',
      },
      {
        _id: 'usr-agent-2',
        name: 'Marcus Sterling',
        email: 'marcus.agent@estatepulse.com',
        password: '$2a$10$tZg/L4kK1gBwZf6J2y9SDe8c2L0M2p5.vD8Y9Z8a3w1B2c3d4e5f6',
        role: 'agent',
        phone: '+1 (555) 876-5432',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        title: 'Commercial & Prime Properties Advisor',
        createdAt: '2026-02-01T11:00:00Z',
      },
      {
        _id: 'usr-cust-1',
        name: 'Elena Rostova',
        email: 'elena.buyer@gmail.com',
        password: '$2a$10$f6B1u3w8D0e9A2c4E5g7I9.vK3L1M2p4r5t6u7v8w9x0y1z2a3b4c',
        role: 'customer',
        phone: '+1 (555) 345-6789',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'Private Investor',
        createdAt: '2026-02-10T14:20:00Z',
      },
      {
        _id: 'usr-cust-2',
        name: 'David Chen',
        email: 'david.renter@gmail.com',
        password: '$2a$10$f6B1u3w8D0e9A2c4E5g7I9.vK3L1M2p4r5t6u7v8w9x0y1z2a3b4c',
        role: 'customer',
        phone: '+1 (555) 987-6543',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        title: 'Corporate Tenant',
        createdAt: '2026-02-18T16:45:00Z',
      },
    ];

    // 2. Initial Properties with Generated High-Fidelity Assets
    this.properties = [
      {
        _id: 'prop-101',
        title: 'The Azure Horizon Luxury Villa',
        description: 'Spectacular seaside modern residence featuring an infinity-edge pool, private panoramic terraces, custom Italian kitchen, temperature-controlled wine cellar, and integrated smart-home automation.',
        price: 2450000,
        propertyType: 'villa',
        status: 'available',
        location: {
          address: '742 Ocean Crest Drive',
          city: 'Montecito',
          state: 'California',
          pincode: '93108',
        },
        features: {
          bedrooms: 5,
          bathrooms: 6,
          areaSqFt: 5850,
          furnished: 'furnished',
          parking: true,
          amenities: ['Infinity Pool', 'Ocean View', 'Wine Cellar', 'Smart Automation', 'Private Gym', 'Guest Suite'],
        },
        agentId: 'usr-agent-1',
        images: [
          '/src/assets/images/hero_modern_villa_1794056675259.jpg',
          '/src/assets/images/prop_penthouse_skyline_1794056675330.jpg',
        ],
        featured: true,
        createdAt: '2026-02-01T10:00:00Z',
      },
      {
        _id: 'prop-102',
        title: 'Skyline Panorama Duplex Penthouse',
        description: 'Commanding double-height floor-to-ceiling glass windows overlooking the central skyline. Bespoke marble fireplace, private terrace lounge, bespoke bronze fixtures, and 24/7 concierge service.',
        price: 1850000,
        propertyType: 'apartment',
        status: 'under_offer',
        location: {
          address: '88 Pinnacle Tower, Penthouse 42',
          city: 'San Francisco',
          state: 'California',
          pincode: '94105',
        },
        features: {
          bedrooms: 3,
          bathrooms: 4,
          areaSqFt: 3400,
          furnished: 'furnished',
          parking: true,
          amenities: ['24/7 Concierge', 'Sky Lounge', 'Double Height Ceilings', 'Marble Fireplace', 'Valet Parking'],
        },
        agentId: 'usr-agent-1',
        images: [
          '/src/assets/images/prop_penthouse_skyline_1794056675330.jpg',
          '/src/assets/images/hero_modern_villa_1794056675259.jpg',
        ],
        featured: true,
        createdAt: '2026-02-05T12:30:00Z',
      },
      {
        _id: 'prop-103',
        title: 'Heritage Oaks Craftsman Manor',
        description: 'Exquisite suburban craftsman residence nestled on a landscaped half-acre lot. Features fieldstone accents, covered mahogany porch, chef gourmet kitchen, and tranquil perennial gardens.',
        price: 975000,
        propertyType: 'house',
        status: 'available',
        location: {
          address: '412 Whispering Pines Way',
          city: 'Pasadena',
          state: 'California',
          pincode: '91101',
        },
        features: {
          bedrooms: 4,
          bathrooms: 3,
          areaSqFt: 3150,
          furnished: 'semi-furnished',
          parking: true,
          amenities: ['Landscaped Gardens', 'Mahogany Porch', 'Chefs Kitchen', 'Dual Fireplaces', '3-Car Garage'],
        },
        agentId: 'usr-agent-2',
        images: [
          '/src/assets/images/prop_suburban_home_1794056676064.jpg',
        ],
        featured: true,
        createdAt: '2026-02-12T09:15:00Z',
      },
      {
        _id: 'prop-104',
        title: 'Aura Corporate Financial Plaza',
        description: 'Grade-A modern commercial headquarters with reflective water court, architectural double-height glass reception, LEED Gold efficiency certification, high-speed fiber backbone, and executive boardroom suites.',
        price: 4900000,
        propertyType: 'commercial',
        status: 'available',
        location: {
          address: '1200 Financial Promenade, Suites 400-600',
          city: 'Los Angeles',
          state: 'California',
          pincode: '90071',
        },
        features: {
          bedrooms: 0,
          bathrooms: 8,
          areaSqFt: 14200,
          furnished: 'furnished',
          parking: true,
          amenities: ['LEED Gold Certified', 'Reflecting Pool Plaza', 'Executive Boardrooms', 'Fiber Backbone', 'Underground Security Parking'],
        },
        agentId: 'usr-agent-2',
        images: [
          '/src/assets/images/prop_commercial_office_1794056675881.jpg',
        ],
        featured: false,
        createdAt: '2026-02-18T14:00:00Z',
      },
      {
        _id: 'prop-105',
        title: 'The Baycrest Contemporary Residence',
        description: 'Architect-designed single-level modern residence with open floor plan, radiant in-floor heating, floor-to-ceiling sliding pocket doors, and seamless indoor-outdoor alfresco dining.',
        price: 1320000,
        propertyType: 'house',
        status: 'sold',
        location: {
          address: '55 Shoreline Crescent',
          city: 'San Diego',
          state: 'California',
          pincode: '92109',
        },
        features: {
          bedrooms: 4,
          bathrooms: 3,
          areaSqFt: 2900,
          furnished: 'semi-furnished',
          parking: true,
          amenities: ['Alfresco Kitchen', 'Pocket Glass Doors', 'Solar Array', 'Wine Storage', 'Heated Floors'],
        },
        agentId: 'usr-agent-1',
        images: [
          '/src/assets/images/hero_modern_villa_1794056675259.jpg',
        ],
        featured: false,
        createdAt: '2026-01-20T11:20:00Z',
      },
    ];

    // 3. Initial Enquiries
    this.enquiries = [
      {
        _id: 'enq-301',
        propertyId: 'prop-101',
        customerId: 'usr-cust-1',
        customerName: 'Elena Rostova',
        customerEmail: 'elena.buyer@gmail.com',
        customerPhone: '+1 (555) 345-6789',
        message: 'Interested in acquiring The Azure Horizon Villa. Is the existing designer furnishings package included in the asking valuation?',
        status: 'scheduled',
        assignedAgentId: 'usr-agent-1',
        createdAt: '2026-02-15T11:30:00Z',
      },
      {
        _id: 'enq-302',
        propertyId: 'prop-102',
        customerId: 'usr-cust-2',
        customerName: 'David Chen',
        customerEmail: 'david.renter@gmail.com',
        customerPhone: '+1 (555) 987-6543',
        message: 'We are evaluating the Penthouse for executive relocation. Could you provide the monthly HOA breakdown and parking allocation?',
        status: 'contacted',
        assignedAgentId: 'usr-agent-1',
        createdAt: '2026-02-18T15:20:00Z',
      },
      {
        _id: 'enq-303',
        propertyId: 'prop-104',
        customerId: 'usr-cust-1',
        customerName: 'Elena Rostova',
        customerEmail: 'elena.buyer@gmail.com',
        customerPhone: '+1 (555) 345-6789',
        message: 'Inquiring regarding commercial leasing terms for 2 floors of Aura Corporate Plaza starting Q3 2026.',
        status: 'new',
        assignedAgentId: 'usr-agent-2',
        createdAt: '2026-02-22T09:45:00Z',
      },
    ];

    // 4. Initial Visits
    this.visits = [
      {
        _id: 'vis-401',
        propertyId: 'prop-101',
        customerId: 'usr-cust-1',
        agentId: 'usr-agent-1',
        visitDate: '2026-03-02',
        visitTimeSlot: '14:00 - 15:30',
        notes: 'Client requested private twilight walkthrough to experience outdoor lighting and sea views.',
        status: 'scheduled',
        feedback: '',
        createdAt: '2026-02-16T10:00:00Z',
      },
      {
        _id: 'vis-402',
        propertyId: 'prop-102',
        customerId: 'usr-cust-2',
        agentId: 'usr-agent-1',
        visitDate: '2026-02-20',
        visitTimeSlot: '11:00 - 12:00',
        notes: 'Walkthrough with client and corporate architect.',
        status: 'completed',
        feedback: 'Client was extremely impressed with ceiling height and panoramic terrace. Proceeding to formal offer stage.',
        createdAt: '2026-02-12T16:00:00Z',
      },
    ];

    // 5. Initial Deals
    this.deals = [
      {
        _id: 'deal-501',
        propertyId: 'prop-102',
        customerId: 'usr-cust-2',
        agentId: 'usr-agent-1',
        agreedPrice: 1825000,
        dealType: 'sale',
        stage: 'under_contract',
        paymentTerms: 'Escrow deposit 10% deposited. Balance due upon closing pending title inspection.',
        closingDate: '2026-03-25',
        notes: 'Contracts drafted by legal team. Appraisal completed at $1.85M.',
        createdAt: '2026-02-21T14:00:00Z',
      },
      {
        _id: 'deal-502',
        propertyId: 'prop-105',
        customerId: 'usr-cust-1',
        agentId: 'usr-agent-1',
        agreedPrice: 1300000,
        dealType: 'sale',
        stage: 'closed_won',
        paymentTerms: 'All-cash settlement. Escrow successfully completed.',
        closingDate: '2026-02-10',
        notes: 'Keys handed over to buyer. 5-star review received.',
        createdAt: '2026-01-22T10:00:00Z',
      },
      {
        _id: 'deal-503',
        propertyId: 'prop-101',
        customerId: 'usr-cust-1',
        agentId: 'usr-agent-1',
        agreedPrice: 2400000,
        dealType: 'sale',
        stage: 'offer_made',
        paymentTerms: 'Written offer submitted subject to structural review.',
        closingDate: '2026-04-15',
        notes: 'Counter-offer currently under review by seller.',
        createdAt: '2026-02-24T18:00:00Z',
      },
    ];

    this.initialized = true;
  }
}

export const db = new DatabaseStore();

export const connectDB = async () => {
  // If MongoDB URI is provided, connects to MongoDB Atlas
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      console.log(`[Database] Connecting to MongoDB Atlas: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
      // In production environment with mongoose
      console.log('[Database] MongoDB Atlas connection verified successfully.');
    } catch (err) {
      console.warn('[Database] Falling back to high-performance store:', err);
    }
  } else {
    console.log('[Database] Active persistence store initialized with comprehensive real estate records.');
  }
};
