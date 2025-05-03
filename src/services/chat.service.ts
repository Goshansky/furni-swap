import api from './api';

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: number;
  users: {
    id: number;
    name: string;
    avatar: string | null;
  }[];
  lastMessage: {
    text: string;
    createdAt: string;
    senderId: number;
  } | null;
  listingId: number;
  listingTitle: string;
  listingImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatData {
  listing_id: number;
  message: string;
}

export interface SendMessageData {
  content: string;
}

class ChatService {
  isTokenAvailable() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  async getChats() {
    try {
      if (!this.isTokenAvailable()) {
        console.warn("No authentication token available for chat service");
        return { chats: [] };
      }

      console.log("Fetching user chats");
      try {
        const response = await api.get('/api/chats');
        console.log("Chats response:", response.data);
        return response.data;
      } catch (error: any) {
        // If server returns 500 error, return empty chats instead of throwing
        console.error("Server error when fetching chats:", error.message);
        return { chats: [] };
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      // Return empty chats array instead of throwing
      return { chats: [] };
    }
  }

  async getChat(id: number) {
    try {
      if (!this.isTokenAvailable()) {
        console.warn("No authentication token available for chat service");
        return { messages: [] };
      }

      console.log("Fetching chat details, ID:", id);
      try {
        const response = await api.get(`/api/chats/${id}`);
        console.log("Chat detail response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching chat details:", error);
        return { messages: [] };
      }
    } catch (error) {
      console.error("Error fetching chat details:", error);
      // Return empty messages array instead of throwing
      return { messages: [] };
    }
  }

  async createChat(data: CreateChatData) {
    try {
      if (!this.isTokenAvailable()) {
        console.warn("No authentication token available for chat service");
        throw new Error("Authentication required");
      }

      console.log("Creating chat with data:", data);
      try {
        const response = await api.post('/api/chats', {
          listing_id: data.listing_id,
          message: data.message
        });
        console.log("Create chat response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Error creating chat:", error);
        // Return a default structure to avoid UI errors
        return { 
          success: false,
          chat: { id: null } 
        };
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      // Return a default structure to avoid UI errors
      return { 
        success: false,
        chat: { id: null } 
      };
    }
  }

  async sendMessage(chatId: number, data: SendMessageData) {
    try {
      if (!this.isTokenAvailable()) {
        console.warn("No authentication token available for chat service");
        throw new Error("Authentication required");
      }

      console.log(`Sending message to chat ID: ${chatId}, data:`, data);
      const response = await api.post(`/api/chats/${chatId}/messages`, {
        content: data.content
      });
      console.log("Send message response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

export default new ChatService(); 