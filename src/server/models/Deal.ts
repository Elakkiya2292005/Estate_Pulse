/**
 * Deal Mongoose Model & Schema
 * Pipeline data management, stages, financial values, closing milestones
 */
import { db, IDeal } from '../config/db.js';

export const DealSchema = {
  propertyId: { type: String, required: true, ref: 'Property' },
  customerId: { type: String, required: true, ref: 'User' },
  agentId: { type: String, required: true, ref: 'User' },
  agreedPrice: { type: Number, required: true, min: 0 },
  dealType: { type: String, enum: ['sale', 'rent'], default: 'sale' },
  stage: {
    type: String,
    enum: ['inquiry', 'offer_made', 'under_contract', 'closed_won', 'closed_lost'],
    default: 'inquiry',
  },
  paymentTerms: { type: String, default: '' },
  closingDate: { type: String, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
};

export const Deal = {
  find: async (filter: { customerId?: string; agentId?: string; stage?: string } = {}) => {
    let list = [...db.deals];

    if (filter.customerId) {
      list = list.filter((d) => d.customerId === filter.customerId);
    }
    if (filter.agentId) {
      list = list.filter((d) => d.agentId === filter.agentId);
    }
    if (filter.stage && filter.stage !== 'all') {
      list = list.filter((d) => d.stage === filter.stage);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list.map((d) => {
      const property = db.properties.find((p) => p._id === d.propertyId);
      const customer = db.users.find((u) => u._id === d.customerId);
      const agent = db.users.find((u) => u._id === d.agentId);

      return {
        ...d,
        property: property
          ? { _id: property._id, title: property.title, price: property.price, location: property.location, images: property.images }
          : null,
        customer: customer
          ? { _id: customer._id, name: customer.name, email: customer.email, phone: customer.phone }
          : null,
        agent: agent
          ? { _id: agent._id, name: agent.name, email: agent.email }
          : null,
      };
    });
  },

  findById: async (id: string) => {
    const deal = db.deals.find((d) => d._id === id);
    if (!deal) return null;
    const property = db.properties.find((p) => p._id === deal.propertyId);
    const customer = db.users.find((u) => u._id === deal.customerId);
    const agent = db.users.find((u) => u._id === deal.agentId);
    return {
      ...deal,
      property: property || null,
      customer: customer || null,
      agent: agent || null,
    };
  },

  create: async (data: Omit<IDeal, '_id' | 'createdAt'>) => {
    const newDeal: IDeal = {
      _id: `deal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      stage: data.stage || 'inquiry',
      createdAt: new Date().toISOString(),
    };
    db.deals.unshift(newDeal);
    return newDeal;
  },

  findByIdAndUpdate: async (id: string, update: Partial<IDeal>) => {
    const index = db.deals.findIndex((d) => d._id === id);
    if (index === -1) return null;
    db.deals[index] = { ...db.deals[index], ...update };
    return db.deals[index];
  },

  findByIdAndDelete: async (id: string) => {
    const index = db.deals.findIndex((d) => d._id === id);
    if (index === -1) return null;
    const [deleted] = db.deals.splice(index, 1);
    return deleted;
  },
};
