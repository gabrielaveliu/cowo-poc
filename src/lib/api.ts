// API client utility for backend communication
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log('[API Client] Using API_URL:', API_URL);

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

export const apiClient = {
  // Bookings
  getAllBookings: async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] getAllBookings error:', error);
      throw error;
    }
  },

  getBookings: async (params: { userId?: string; roomId?: string; date?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params.userId) query.set('userId', params.userId);
      if (params.roomId) query.set('roomId', params.roomId);
      if (params.date) query.set('date', params.date);

      const queryString = query.toString() ? `?${query.toString()}` : '';
      const response = await fetch(`${API_URL}/api/bookings${queryString}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] getBookings error:', error);
      throw error;
    }
  },

  getUserBookings: async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings?userId=${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] getUserBookings error:', error);
      throw error;
    }
  },

  createBooking: async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] createBooking error:', error);
      throw error;
    }
  },

  deleteBooking: async (bookingId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] deleteBooking error:', error);
      throw error;
    }
  },

  // Pricing
  getPricing: async (month?: string) => {
    try {
      const url = month 
        ? `${API_URL}/api/pricing?month=${month}`
        : `${API_URL}/api/pricing`;
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] getPricing error:', error);
      throw error;
    }
  },

  updatePricing: async (month: string, pricing: Record<string, number>) => {
    try {
      const patchResponse = await fetch(`${API_URL}/api/pricing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, pricing }),
      });

      if (patchResponse.ok) {
        return await handleResponse(patchResponse);
      }

      if (patchResponse.status === 404 || patchResponse.status === 405) {
        const postResponse = await fetch(`${API_URL}/api/pricing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ month, pricing }),
        });
        return await handleResponse(postResponse);
      }

      return await handleResponse(patchResponse);
    } catch (error) {
      console.error('[API] updatePricing error:', error);
      throw error;
    }
  },

  // Billing
  getBillingReport: async (month: string) => {
    try {
      const response = await fetch(`${API_URL}/api/billing?month=${month}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] getBillingReport error:', error);
      throw error;
    }
  },

  // Users
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] getAllUsers error:', error);
      throw error;
    }
  },

  getUser: async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] getUser error:', error);
      throw error;
    }
  },
};
