/**
 * Reports & Analytics Controller
 * Aggregates summary KPIs, deals pipeline analytics, and inventory distribution
 */
import { Response } from 'express';
import { db } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getDashboardAnalytics = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const properties = db.properties;
    const enquiries = db.enquiries;
    const visits = db.visits;
    const deals = db.deals;

    // Total counts
    const totalProperties = properties.length;
    const availableProperties = properties.filter((p) => p.status === 'available').length;
    const underOfferProperties = properties.filter((p) => p.status === 'under_offer').length;
    const closedProperties = properties.filter((p) => p.status === 'sold' || p.status === 'rented').length;

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;

    const totalVisits = visits.length;
    const scheduledVisits = visits.filter((v) => v.status === 'scheduled').length;
    const completedVisits = visits.filter((v) => v.status === 'completed').length;

    // Financial Metrics
    const totalPipelineValue = deals
      .filter((d) => d.stage !== 'closed_lost')
      .reduce((acc, d) => acc + (d.agreedPrice || 0), 0);

    const closedRevenue = deals
      .filter((d) => d.stage === 'closed_won')
      .reduce((acc, d) => acc + (d.agreedPrice || 0), 0);

    // Deals by Stage
    const dealsByStage = {
      inquiry: deals.filter((d) => d.stage === 'inquiry').length,
      offer_made: deals.filter((d) => d.stage === 'offer_made').length,
      under_contract: deals.filter((d) => d.stage === 'under_contract').length,
      closed_won: deals.filter((d) => d.stage === 'closed_won').length,
      closed_lost: deals.filter((d) => d.stage === 'closed_lost').length,
    };

    // Properties by Type
    const propertyTypeDistribution = {
      villa: properties.filter((p) => p.propertyType === 'villa').length,
      apartment: properties.filter((p) => p.propertyType === 'apartment').length,
      house: properties.filter((p) => p.propertyType === 'house').length,
      commercial: properties.filter((p) => p.propertyType === 'commercial').length,
      plot: properties.filter((p) => p.propertyType === 'plot').length,
    };

    // Agent performance metrics
    const agents = db.users.filter((u) => u.role === 'agent');
    const agentLeaderboard = agents.map((agent) => {
      const agentDeals = deals.filter((d) => d.agentId === agent._id);
      const wonDeals = agentDeals.filter((d) => d.stage === 'closed_won');
      const wonVolume = wonDeals.reduce((sum, d) => sum + d.agreedPrice, 0);
      const activeVisits = visits.filter((v) => v.agentId === agent._id && v.status === 'scheduled').length;

      return {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        avatar: agent.avatar,
        title: agent.title,
        totalDeals: agentDeals.length,
        closedWon: wonDeals.length,
        closedVolume: wonVolume,
        activeVisits,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalProperties,
          availableProperties,
          underOfferProperties,
          closedProperties,
          totalEnquiries,
          newEnquiries,
          totalVisits,
          scheduledVisits,
          completedVisits,
          totalPipelineValue,
          closedRevenue,
        },
        dealsByStage,
        propertyTypeDistribution,
        agentLeaderboard,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error compiling analytics' });
  }
};
