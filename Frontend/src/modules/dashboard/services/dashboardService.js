/**
 * Dashboard service - aggregates data from multiple module services.
 * Individual module services handle their own API calls;
 * this service provides dashboard-specific endpoints if needed.
 */
import eventService from '@/modules/events/services/eventService';
import postService from '@/modules/posts/services/postService';
import memberService from '@/modules/members/services/memberService';
import fundService from '@/modules/funds/services/fundService';

const dashboardService = {
  getUpcomingEvents: () => eventService.getUpcoming(),
  getFeaturedPosts: () => postService.getFeatured(),
  getMemberCount: () => memberService.getPaged(1, 1),
  getFundReport: () => fundService.getReport(),
  getAllEvents: () => eventService.getPaged(1, 1),
};

export default dashboardService;
