/**
 * Property Mongoose Model & Schema
 * Features, price, status, location, images, agent
 */
import { db, IProperty } from '../config/db.js';

export const PropertySchema = {
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'commercial', 'house', 'plot'],
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'under_offer', 'sold', 'rented'],
    default: 'available',
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  features: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaSqFt: { type: Number, required: true },
    furnished: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished'], default: 'semi-furnished' },
    parking: { type: Boolean, default: false },
    amenities: [{ type: String }],
  },
  agentId: { type: String, required: true, ref: 'User' },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
};

export interface PropertyQueryOptions {
  search?: string;
  propertyType?: string;
  status?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  agentId?: string;
  featured?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'area_desc';
  page?: number;
  limit?: number;
}

export const Property = {
  find: async (options: PropertyQueryOptions = {}) => {
    let result = [...db.properties];

    // Search filter
    if (options.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q)
      );
    }

    // Property Type
    if (options.propertyType && options.propertyType !== 'all') {
      result = result.filter((p) => p.propertyType === options.propertyType);
    }

    // Status
    if (options.status && options.status !== 'all') {
      result = result.filter((p) => p.status === options.status);
    }

    // City
    if (options.city && options.city !== 'all') {
      result = result.filter((p) => p.location.city.toLowerCase() === options.city?.toLowerCase());
    }

    // Price range
    if (options.minPrice !== undefined && !isNaN(options.minPrice)) {
      result = result.filter((p) => p.price >= Number(options.minPrice));
    }
    if (options.maxPrice !== undefined && !isNaN(options.maxPrice)) {
      result = result.filter((p) => p.price <= Number(options.maxPrice));
    }

    // Bedrooms
    if (options.bedrooms !== undefined && !isNaN(options.bedrooms) && Number(options.bedrooms) > 0) {
      result = result.filter((p) => p.features.bedrooms >= Number(options.bedrooms));
    }

    // Agent
    if (options.agentId) {
      result = result.filter((p) => p.agentId === options.agentId);
    }

    // Featured
    if (options.featured !== undefined) {
      result = result.filter((p) => p.featured === options.featured);
    }

    // Sorting
    switch (options.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'area_desc':
        result.sort((a, b) => b.features.areaSqFt - a.features.areaSqFt);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = result.length;
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 9);
    const skip = (page - 1) * limit;
    const paginated = result.slice(skip, skip + limit);

    // Populate agent info
    const populated = paginated.map((p) => {
      const agent = db.users.find((u) => u._id === p.agentId);
      return {
        ...p,
        agent: agent ? { _id: agent._id, name: agent.name, email: agent.email, phone: agent.phone, avatar: agent.avatar, title: agent.title } : null,
      };
    });

    return {
      properties: populated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById: async (id: string) => {
    const prop = db.properties.find((p) => p._id === id);
    if (!prop) return null;
    const agent = db.users.find((u) => u._id === prop.agentId);
    return {
      ...prop,
      agent: agent ? { _id: agent._id, name: agent.name, email: agent.email, phone: agent.phone, avatar: agent.avatar, title: agent.title } : null,
    };
  },

  create: async (data: Omit<IProperty, '_id' | 'createdAt'>) => {
    const newProperty: IProperty = {
      _id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    db.properties.unshift(newProperty);
    return newProperty;
  },

  findByIdAndUpdate: async (id: string, update: Partial<IProperty>) => {
    const index = db.properties.findIndex((p) => p._id === id);
    if (index === -1) return null;
    db.properties[index] = { ...db.properties[index], ...update };
    return db.properties[index];
  },

  findByIdAndDelete: async (id: string) => {
    const index = db.properties.findIndex((p) => p._id === id);
    if (index === -1) return null;
    const [deleted] = db.properties.splice(index, 1);
    return deleted;
  },
};
