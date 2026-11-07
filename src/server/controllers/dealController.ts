/**
 * Deal Controller
 * Pipeline tracking, financial closing terms, stage transitions
 */
import { Response } from 'express';
import { Deal } from '../models/Deal.js';
import { Property } from '../models/Property.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const createDeal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      propertyId,
      customerId,
      agentId,
      agreedPrice,
      dealType,
      stage,
      paymentTerms,
      closingDate,
      notes,
    } = req.body;

    // Validation
    const errors: Record<string, string> = {};
    if (!propertyId) errors.propertyId = 'Property is required';
    if (!customerId) errors.customerId = 'Customer is required';
    if (!agreedPrice || Number(agreedPrice) <= 0) errors.agreedPrice = 'Valid agreed valuation is required';
    if (!closingDate) errors.closingDate = 'Target closing date is required';

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ success: false, message: 'Please correct deal form errors', errors });
      return;
    }

    const assignedAgent = agentId || req.user?._id || 'usr-agent-1';

    const deal = await Deal.create({
      propertyId,
      customerId,
      agentId: assignedAgent,
      agreedPrice: Number(agreedPrice),
      dealType: dealType || 'sale',
      stage: stage || 'inquiry',
      paymentTerms: paymentTerms || 'Standard escrow terms',
      closingDate,
      notes: notes || '',
    });

    // If deal reached 'under_contract' or 'closed_won', update property status
    if (stage === 'under_contract') {
      await Property.findByIdAndUpdate(propertyId, { status: 'under_offer' });
    } else if (stage === 'closed_won') {
      await Property.findByIdAndUpdate(propertyId, { status: dealType === 'rent' ? 'rented' : 'sold' });
    }

    res.status(201).json({
      success: true,
      message: 'Deal record established successfully in pipeline',
      data: deal,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating deal' });
  }
};

export const getDeals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { stage } = req.query;
    const user = req.user;

    const filter: { customerId?: string; agentId?: string; stage?: string } = {};
    if (stage) filter.stage = stage as string;

    if (user?.role === 'customer') {
      filter.customerId = user._id;
    } else if (user?.role === 'agent') {
      filter.agentId = user._id;
    }
    // Admin sees all

    const list = await Deal.find(filter);

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDealStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stage, agreedPrice, paymentTerms, closingDate, notes } = req.body;

    const existing = await Deal.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Deal not found' });
      return;
    }

    if (req.user?.role === 'agent' && existing.agentId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only update deals assigned to you.' });
      return;
    }

    const updateData: any = {};
    if (stage) updateData.stage = stage;
    if (agreedPrice) updateData.agreedPrice = Number(agreedPrice);
    if (paymentTerms !== undefined) updateData.paymentTerms = paymentTerms;
    if (closingDate) updateData.closingDate = closingDate;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await Deal.findByIdAndUpdate(id, updateData);

    // Sync property status with deal stage
    if (stage === 'under_contract') {
      await Property.findByIdAndUpdate(existing.propertyId, { status: 'under_offer' });
    } else if (stage === 'closed_won') {
      await Property.findByIdAndUpdate(existing.propertyId, {
        status: existing.dealType === 'rent' ? 'rented' : 'sold',
      });
    }

    res.status(200).json({
      success: true,
      message: `Deal updated to stage: ${stage}`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDeal = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = _req.params;
    const deleted = await Deal.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Deal not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Deal deleted successfully',
      data: deleted,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
