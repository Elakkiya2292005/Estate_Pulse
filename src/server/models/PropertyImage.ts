/**
 * PropertyImage Mongoose Model & Schema
 */
import { db, IPropertyImage } from '../config/db.js';

export const PropertyImageSchema = {
  propertyId: { type: String, required: true, ref: 'Property' },
  url: { type: String, required: true },
  caption: { type: String },
  isPrimary: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
};

export const PropertyImage = {
  find: async (filter: Partial<IPropertyImage> = {}) => {
    return db.propertyImages.filter((img) => {
      if (filter.propertyId && img.propertyId !== filter.propertyId) return false;
      return true;
    });
  },

  create: async (data: Omit<IPropertyImage, '_id' | 'createdAt'>) => {
    const newImage: IPropertyImage = {
      _id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    db.propertyImages.push(newImage);
    return newImage;
  },

  deleteByPropertyId: async (propertyId: string) => {
    db.propertyImages = db.propertyImages.filter((img) => img.propertyId !== propertyId);
  },
};
