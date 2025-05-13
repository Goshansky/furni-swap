import api from './api';

export interface Purchase {
  id: number;
  listing_id: number;
  title: string;
  price: number;
  image: string;
  seller_name: string;
  category: string;
  purchase_date: string;
  status: 'completed' | 'processing' | 'cancelled';
}

class PurchaseService {
  async getPurchases() {
    try {
      const response = await api.get('/api/purchases');
      return response.data?.purchases || [];
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      return [];
    }
  }

  async getPurchaseDetails(id: number) {
    try {
      const response = await api.get(`/api/purchases/${id}`);
      return response.data?.purchase;
    } catch (error) {
      console.error(`Error fetching purchase details for ID ${id}:`, error);
      return null;
    }
  }
}

export default new PurchaseService(); 