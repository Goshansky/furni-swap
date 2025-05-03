import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  city: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface UpdateProfileData {
  name?: string;
  city?: string;
}

class UserService {
  async getProfile() {
    const response = await api.get('/api/profile');
    const userData = response.data;
    
    // Сохраняем информацию о пользователе в localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  }

  async updateProfile(data: UpdateProfileData) {
    const response = await api.put('/api/profile', data);
    
    // Обновляем информацию о пользователе в localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
    
    return response.data;
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/api/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Обновляем информацию о пользователе в localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, avatar: response.data.avatar }));
    
    return response.data;
  }
}

export default new UserService(); 