import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Для работы с куками при авторизации
  timeout: 10000 // 10 second timeout
});

// Интерсептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  } else {
    console.debug(`API Request (no auth): ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Интерсептор для обработки ошибок
api.interceptors.response.use(
  (response) => {
    console.debug(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.response) {
      // Сервер вернул ответ со статусом отличным от 2xx
      console.error(`API Error ${error.response.status} on ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response.data);
      
      // При 401 ошибке (не авторизован) редиректим на страницу логина
      if (error.response.status === 401) {
        console.warn('Authentication token expired or invalid, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // При 500 ошибке выводим дополнительную информацию
      if (error.response.status === 500) {
        console.error('Server error details:', error.response.data);
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('No response received:', error.request);
    } else {
      // Произошла ошибка при настройке запроса
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 