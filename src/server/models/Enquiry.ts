/**
 * Enquiry Mongoose Model & Schema
 * Captures user inquiries, assigns agent, tracks status
 */
import { db, IEnquiry } from '../config/db.js';

export const EnquirySchema = {
  propertyId: { type: String, required: true, ref: 'Property' },
  customerId: { type: String, required: true, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'scheduled', 'closed'],
    default: 'new',
  },
  assignedAgentId: { type: String, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
};

export const Enquiry = {
  find: async (filter: { customerId?: string; assignedAgentId?: string; status?: string } = {}) => {
    let list = [...db.enquiries];

    if (filter.customerId) {
      list = list.filter((e) => e.customerId === filter.customerId);
    }
    if (filter.assignedAgentId) {
      list = list.filter((e) => e.assignedAgentId === filter.assignedAgentId);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter((e) => e.status === filter.status);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Populate property and agent details
    return list.map((e) => {
      const property = db.properties.find((p) => p._id === e.propertyId);
      const agent = db.users.find((u) => u._id === e.assignedAgentId);
      return {
        ...e,
        property: property
          ? { _id: property._id, title: property.title, price: property.price, location: property.location, images: property.images }
          : null,
        agent: agent ? { _id: agent._id, name: agent.name, email: agent.email, phone: agent.phone } : null,
      };
    });
  },

  findById: async (id: string) => {
    const enquiry = db.enquiries.find((e) => e._id === id);
    if (!enquiry) return null;
    const property = db.properties.find((p) => p._id === enquiry.propertyId);
    const agent = db.users.find((u) => u._id === enquiry.assignedAgentId);
    return {
      ...enquiry,
      property: property || null,
      agent: agent || null,
    };
  },

  create: async (data: Omit<IEnquiry, '_id' | 'createdAt'>) => {
    const newEnquiry: IEnquiry = {
      _id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      status: data.status || 'new',
      createdAt: new Date().toISOString(),
    };
    db.enquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  findByIdAndUpdate: async (id: string, update: Partial<IEnquiry>) => {
    const index = db.enquiries.findIndex((e) => e._id === id);
    if (index === -1) return null;
    db.enquiries[index] = { ...db.enquiries[index], ...update };
    return db.enquiries[index];
  },

  findByIdAndDelete: async (id: string) => {
    const index = db.enquiries.findIndex((e) => e._id === id);
    if (index === -1) return null;
    const [deleted] = db.enquiries.splice(index, 1);
    return deleted;
  },
};
