/**
 * Visit Mongoose Model & Schema
 * Schedules property walkthroughs, tracks status and agent feedback
 */
import { db, IVisit } from '../config/db.js';

export const VisitSchema = {
  propertyId: { type: String, required: true, ref: 'Property' },
  customerId: { type: String, required: true, ref: 'User' },
  agentId: { type: String, required: true, ref: 'User' },
  visitDate: { type: String, required: true },
  visitTimeSlot: { type: String, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  feedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
};

export const Visit = {
  find: async (filter: { customerId?: string; agentId?: string; status?: string } = {}) => {
    let list = [...db.visits];

    if (filter.customerId) {
      list = list.filter((v) => v.customerId === filter.customerId);
    }
    if (filter.agentId) {
      list = list.filter((v) => v.agentId === filter.agentId);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter((v) => v.status === filter.status);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list.map((v) => {
      const property = db.properties.find((p) => p._id === v.propertyId);
      const customer = db.users.find((u) => u._id === v.customerId);
      const agent = db.users.find((u) => u._id === v.agentId);

      return {
        ...v,
        property: property
          ? { _id: property._id, title: property.title, price: property.price, location: property.location, images: property.images }
          : null,
        customer: customer
          ? { _id: customer._id, name: customer.name, email: customer.email, phone: customer.phone, avatar: customer.avatar }
          : null,
        agent: agent
          ? { _id: agent._id, name: agent.name, email: agent.email, phone: agent.phone }
          : null,
      };
    });
  },

  findById: async (id: string) => {
    const visit = db.visits.find((v) => v._id === id);
    if (!visit) return null;
    const property = db.properties.find((p) => p._id === visit.propertyId);
    const customer = db.users.find((u) => u._id === visit.customerId);
    const agent = db.users.find((u) => u._id === visit.agentId);
    return {
      ...visit,
      property: property || null,
      customer: customer || null,
      agent: agent || null,
    };
  },

  create: async (data: Omit<IVisit, '_id' | 'createdAt'>) => {
    const newVisit: IVisit = {
      _id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      status: data.status || 'scheduled',
      feedback: data.feedback || '',
      createdAt: new Date().toISOString(),
    };
    db.visits.unshift(newVisit);
    return newVisit;
  },

  findByIdAndUpdate: async (id: string, update: Partial<IVisit>) => {
    const index = db.visits.findIndex((v) => v._id === id);
    if (index === -1) return null;
    db.visits[index] = { ...db.visits[index], ...update };
    return db.visits[index];
  },

  findByIdAndDelete: async (id: string) => {
    const index = db.visits.findIndex((v) => v._id === id);
    if (index === -1) return null;
    const [deleted] = db.visits.splice(index, 1);
    return deleted;
  },
};
