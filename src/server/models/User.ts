/**
 * User Mongoose Model & Schema
 * Role: Admin, Agent, Customer
 */
import { db, IUser } from '../config/db.js';

export const UserSchema = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'agent', 'customer'], default: 'customer' },
  phone: { type: String, required: true },
  avatar: { type: String },
  title: { type: String },
  createdAt: { type: Date, default: Date.now },
};

export const User = {
  find: async (filter: Partial<IUser> = {}) => {
    return db.users
      .filter((u) => {
        if (filter.role && u.role !== filter.role) return false;
        if (filter.email && u.email !== filter.email) return false;
        return true;
      })
      .map(({ password, ...rest }) => rest);
  },

  findOne: async (query: { email?: string; _id?: string }) => {
    if (query.email) {
      return db.users.find((u) => u.email.toLowerCase() === query.email?.toLowerCase());
    }
    if (query._id) {
      return db.users.find((u) => u._id === query._id);
    }
    return null;
  },

  findById: async (id: string) => {
    const user = db.users.find((u) => u._id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  findByIdWithPassword: async (id: string) => {
    return db.users.find((u) => u._id === id) || null;
  },

  create: async (data: Omit<IUser, '_id' | 'createdAt'>) => {
    const newUser: IUser = {
      _id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  findByIdAndUpdate: async (id: string, update: Partial<IUser>) => {
    const index = db.users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...update };
    const { password, ...safeUser } = db.users[index];
    return safeUser;
  },

  findByIdAndDelete: async (id: string) => {
    const index = db.users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    const [deleted] = db.users.splice(index, 1);
    return deleted;
  },
};
