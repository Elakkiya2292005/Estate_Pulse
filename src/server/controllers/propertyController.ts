/**
 * Property Controller
 * Handles search, filter, pagination, sorting, CRUD, and agent assignment
 */
import { Request, Response } from 'express';
import { Property } from '../models/Property.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      propertyType,
      status,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      agentId,
      featured,
      sortBy,
      page,
      limit,
    } = req.query;

    const result = await Property.find({
      search: search as string,
      propertyType: propertyType as string,
      status: status as string,
      city: city as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      agentId: agentId as string,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      sortBy: sortBy as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 9,
    });

    res.status(200).json({
      success: true,
      data: result.properties,
      pagination: result.pagination,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching properties' });
  }
};

export const getFeaturedProperties = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await Property.find({ featured: true, limit: 3 });
    res.status(200).json({
      success: true,
      data: result.properties,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      price,
      propertyType,
      status,
      location,
      features,
      agentId,
      images,
      featured,
    } = req.body;

    // Server-side validation
    const errors: Record<string, string> = {};
    if (!title || title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
    if (!description || description.trim().length < 10) errors.description = 'Description must be at least 10 characters';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errors.price = 'Valid price greater than 0 is required';
    if (!propertyType) errors.propertyType = 'Property type is required';
    if (!location?.address) errors.address = 'Street address is required';
    if (!location?.city) errors.city = 'City is required';
    if (!location?.pincode) errors.pincode = 'Pincode/ZIP is required';
    if (!features?.areaSqFt || Number(features.areaSqFt) <= 0) errors.areaSqFt = 'Valid area in Sq Ft is required';

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ success: false, message: 'Please fill in all required fields correctly', errors });
      return;
    }

    const assignedAgent = agentId || req.user?._id || 'usr-agent-1';

    const defaultImages = [
      '/src/assets/images/hero_modern_villa_1794056675259.jpg',
      '/src/assets/images/prop_penthouse_skyline_1794056675330.jpg',
    ];

    const property = await Property.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      propertyType,
      status: status || 'available',
      location: {
        address: location.address.trim(),
        city: location.city.trim(),
        state: location.state?.trim() || 'California',
        pincode: location.pincode.trim(),
      },
      features: {
        bedrooms: Number(features.bedrooms || 0),
        bathrooms: Number(features.bathrooms || 0),
        areaSqFt: Number(features.areaSqFt),
        furnished: features.furnished || 'semi-furnished',
        parking: !!features.parking,
        amenities: Array.isArray(features.amenities) ? features.amenities : ['Central AC', 'Smart Security'],
      },
      agentId: assignedAgent,
      images: images && images.length > 0 ? images : defaultImages,
      featured: !!featured,
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating property' });
  }
};

export const updateProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await Property.findById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    // Role check: Admin or assigned agent can update
    if (req.user?.role === 'agent' && existing.agentId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only edit properties assigned to you.' });
      return;
    }

    const updated = await Property.findByIdAndUpdate(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProperty = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = _req.params;
    const deleted = await Property.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      data: deleted,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
