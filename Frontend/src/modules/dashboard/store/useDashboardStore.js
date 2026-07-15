import { create } from 'zustand';
import eventService from '@/modules/events/services/eventService';
import postService from '@/modules/posts/services/postService';
import memberService from '@/modules/members/services/memberService';
import fundService from '@/modules/funds/services/fundService';
import useUiStore from '@/stores/uiStore';

export const useDashboardStore = create((set) => ({
  loading: true,
  upcomingEvents: [],
  featuredPosts: [],
  totalMembers: 0,
  totalEvents: 0,
  fundBalance: 0,

  resetStore: () => set({
    loading: true,
    upcomingEvents: [],
    featuredPosts: [],
    totalMembers: 0,
    totalEvents: 0,
    fundBalance: 0,
  }),

  loadDashboardData: async () => {
    set({ loading: true });
    try {
      const [eventsRes, postsRes, membersRes, fundRes, allEventsRes] = await Promise.all([
        eventService.getUpcoming().catch(() => ({ success: false, data: [] })),
        postService.getFeatured().catch(() => ({ success: false, data: [] })),
        memberService.getPaged(1, 1).catch(() => ({ success: false, data: null })),
        fundService.getReport().catch(() => ({ success: false, data: null })),
        eventService.getPaged(1, 1).catch(() => ({ success: false, data: null })),
      ]);

      const updates = {};
      if (eventsRes.success) updates.upcomingEvents = eventsRes.data || [];
      if (postsRes.success) updates.featuredPosts = postsRes.data || [];
      if (membersRes.success && membersRes.data) {
        updates.totalMembers = membersRes.data.totalElements || 0;
      }
      if (fundRes.success && fundRes.data) {
        updates.fundBalance = fundRes.data.totalBalance || 0;
      }
      if (allEventsRes.success && allEventsRes.data) {
        updates.totalEvents = allEventsRes.data.totalElements || 0;
      }
      set(updates);
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Không thể tải một số dữ liệu từ máy chủ', 'warning');
    } finally {
      set({ loading: false });
    }
  },
}));
