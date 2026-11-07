/**
 * Visit Controller
 * Walkthrough appointment scheduling, status tracking, agent feedback
 */
import { Response } from 'express';
import { Visit } from '../models/Visit.js';
import { Property } from '../models/Property.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const scheduleVisit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, visitDate, visitTimeSlot, notes } = req.body;
    const customerId = req.user?._id;

    if (!customerId) {
      res.status(401).json({ success: false, message: 'Please log in to schedule a private walkthrough.' });
      return;
    }

    const errors: Record<string, string> = {};
    if (!propertyId) errors.propertyId = 'Property selection is required';
    if (!visitDate) errors.visitDate = 'Date is required';
    if (!visitTimeSlot) errors.visitTimeSlot = 'Time slot is required';

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ success: false, message: 'Please fill in all scheduling fields', errors });
      return;
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    const agentId = property.agentId || 'usr-agent-1';

    const visit = await Visit.create({
      propertyId,
      customerId,
      agentId,
      visitDate,
      visitTimeSlot,
      notes: notes || '',
      status: 'scheduled',
      feedback: '',
    });

    res.status(201).json({
      success: true,
      message: 'Property visit successfully scheduled. Confirmation sent to your agent.',
      data: visit,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error scheduling visit' });
  }
};

export const getVisits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const user = req.user;

    const filter: { customerId?: string; agentId?: string; status?: string } = {};
    if (status) filter.status = status as string;

    if (user?.role === 'customer') {
      filter.customerId = user._id;
    } else if (user?.role === 'agent') {
      filter.agentId = user._id;
    }
    // Admin sees all

    const visits = await Visit.find(filter);

    res.status(200).json({
      success: true,
      data: visits,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVisit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, feedback, visitDate, visitTimeSlot, notes } = req.body;

    const existing = await Visit.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Visit record not found' });
      return;
    }

    // Role check
    if (req.user?.role === 'customer' && existing.customerId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only modify your own visits.' });
      return;
    }
    if (req.user?.role === 'agent' && existing.agentId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only update visits assigned to you.' });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (visitDate) updateData.visitDate = visitDate;
    if (visitTimeSlot) updateData.visitTimeSlot = visitTimeSlot;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await Visit.findByIdAndUpdate(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Visit updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelVisit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await Visit.findById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Visit not found' });
      return;
    }

    if (
      req.user?.role === 'customer' &&
      existing.customerId !== req.user._id
    ) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only cancel your own visits.' });
      return;
    }

    const updated = await Visit.findByIdAndUpdate(id, { status: 'cancelled' });

    res.status(200).json({
      success: true,
      message: 'Visit has been cancelled',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
