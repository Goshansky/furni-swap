import api from './api';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  category_id?: number;
  location: string;
  condition: string;
  userId: number;
  images: string[];
  mainImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  condition?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category_id: number;
  city: string;
  condition: string;
}

class ListingService {
  async getListings(filters: ListingFilter = {}) {
    console.log("Fetching listings with filters:", filters);
    
    // Convert filter parameters to match backend API expectations
    const apiParams: any = {
      page: filters.page || 1,
      limit: filters.limit || 20
    };
    
    if (filters.category) {
      // Ensure category is properly formatted for API
      apiParams.category = encodeURIComponent(filters.category);
    }
    
    if (filters.minPrice !== undefined) {
      apiParams.min_price = filters.minPrice;
    }
    
    if (filters.maxPrice !== undefined) {
      apiParams.max_price = filters.maxPrice;
    }
    
    if (filters.location) {
      apiParams.location = filters.location;
    }
    
    if (filters.condition) {
      apiParams.condition = filters.condition;
    }
    
    if (filters.search) {
      // Ensure search term is properly formatted for API
      apiParams.search = encodeURIComponent(filters.search);
    }
    
    try {
      // Log the complete API request URL for debugging
      console.log("API request params:", apiParams);
      
      // Use the correct endpoint with correct parameters
      const response = await api.get('/api/listings', { params: apiParams });
      console.log("Listings response:", response.data);
      
      // Ensure the returned listings have all required fields
      if (response.data && response.data.listings) {
        response.data.listings = response.data.listings.map((listing: any) => {
          return {
            ...listing,
            // Add fallbacks for missing fields with proper priority
            location: listing.location || listing.city || 'Не указано',
            // Handle category mapping from category_id if needed
            category: listing.category || this.mapCategoryIdToName(listing.category_id) || 'Не указана'
          };
        });
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching listings:", error);
      return { listings: [] };
    }
  }

  async getListing(id: number) {
    console.log("Fetching listing details, ID:", id);
    try {
      const response = await api.get(`/api/listings/${id}`);
      console.log("Listing detail response:", response.data);
      
      // Ensure the returned listing has all required fields
      if (response.data && response.data.listing) {
        response.data.listing = {
          ...response.data.listing,
          // Add fallbacks for missing fields
          location: response.data.listing.location || response.data.listing.city || 'Не указано',
          // Handle category mapping from category_id if needed
          category: response.data.listing.category || this.mapCategoryIdToName(response.data.listing.category_id) || 'Не указана',
          description: response.data.listing.description || 'Описание отсутствует'
        };
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching listing details:", error);
      throw error;
    }
  }

  // Helper function to map category_id to category name
  mapCategoryIdToName(categoryId?: number): string {
    if (!categoryId) return '';
    
    const categoryMap: {[key: number]: string} = {
      1: 'Диваны и кресла',
      2: 'Столы и стулья',
      3: 'Шкафы и комоды',
      4: 'Кровати и матрасы',
      5: 'Другое'
    };
    
    return categoryMap[categoryId] || '';
  }

  async createListing(data: CreateListingData) {
    console.log("Creating listing with data:", data);
    try {
      // Ensure we're using the correct API endpoint
      const response = await api.post('/api/listings', data);
      console.log("Create listing response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  }

  async updateListing(id: number, data: Partial<CreateListingData>) {
    const response = await api.put(`/api/listings/${id}`, data);
    return response.data;
  }

  async deleteListing(id: number) {
    const response = await api.delete(`/api/listings/${id}`);
    return response.data;
  }

  // Работа с изображениями
  async uploadImage(listingId: number, image: File) {
    console.log("Uploading image for listing ID:", listingId);
    if (!listingId) {
      console.error("Invalid listing ID for image upload");
      throw new Error("Недопустимый ID объявления для загрузки изображения");
    }
    
    const formData = new FormData();
    formData.append('image', image);
    
    try {
      const response = await api.post(`/api/listings/${listingId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Upload image response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async deleteImage(listingId: number, imageId: number) {
    const response = await api.delete(`/api/listings/${listingId}/images/${imageId}`);
    return response.data;
  }

  async setMainImage(listingId: number, imageId: number) {
    console.log(`Setting main image, listing ID: ${listingId}, image ID: ${imageId}`);
    try {
      const response = await api.put(`/api/listings/${listingId}/images/${imageId}/main`);
      console.log("Set main image response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error setting main image:", error);
      throw error;
    }
  }

  // Работа с избранным
  async addToFavorites(listingId: number) {
    console.log("Adding to favorites, listing ID:", listingId);
    try {
      const response = await api.post(`/api/listings/${listingId}/favorite`);
      console.log("Add to favorites response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  }

  async removeFromFavorites(listingId: number) {
    console.log("Removing from favorites, listing ID:", listingId);
    try {
      const response = await api.delete(`/api/listings/${listingId}/favorite`);
      console.log("Remove from favorites response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  }

  async checkFavorite(listingId: number) {
    console.log("Checking favorite status, listing ID:", listingId);
    try {
      const response = await api.get(`/api/listings/${listingId}/favorite`);
      console.log("Check favorite response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      throw error;
    }
  }

  async getFavorites() {
    const response = await api.get('/api/favorites');
    return response.data;
  }
}

export default new ListingService(); 