/**
 * Enquiry Controller
 * Handles customer inquiries, agent notifications, and status progression
 */
import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';
import { Property } from '../models/Property.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId, customerName, customerEmail, customerPhone, message, customerId } = req.body;

    // Server-side validation
    const errors: Record<string, string> = {};
    if (!propertyId) errors.propertyId = 'Property ID is required';
    if (!customerName || customerName.trim().length === 0) errors.customerName = 'Your name is required';
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) errors.customerEmail = 'Valid email is required';
    if (!customerPhone || customerPhone.trim().length < 7) errors.customerPhone = 'Valid phone number is required';
    if (!message || message.trim().length < 5) errors.message = 'Please provide a message with at least 5 characters';

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ success: false, message: 'Please correct the form errors', errors });
      return;
    }

    // Lookup property to get assigned agent
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    const assignedAgentId = property.agentId || 'usr-agent-1';

    const enquiry = await Enquiry.create({
      propertyId,
      customerId: customerId || 'usr-cust-1',
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      message: message.trim(),
      status: 'new',
      assignedAgentId,
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. An agent will contact you shortly.',
      data: enquiry,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error submitting enquiry' });
  }
};

export const getEnquiries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const user = req.user;

    let filter: { customerId?: string; assignedAgentId?: string; status?: string } = {};

    if (status) {
      filter.status = status as string;
    }

    // Role-based filtering
    if (user?.role === 'customer') {
      filter.customerId = user._id;
    } else if (user?.role === 'agent') {
      filter.assignedAgentId = user._id;
    }
    // Admin sees all

    const list = await Enquiry.find(filter);

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEnquiryStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedAgentId } = req.body;

    const existing = await Enquiry.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    // Agents can only update status of their assigned enquiries
    if (req.user?.role === 'agent' && existing.assignedAgentId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only update your assigned enquiries.' });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedAgentId && req.user?.role === 'admin') updateData.assignedAgentId = assignedAgentId;

    const updated = await Enquiry.findByIdAndUpdate(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteEnquiry = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = _req.params;
    const deleted = await Enquiry.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry removed successfully',
      data: deleted,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
