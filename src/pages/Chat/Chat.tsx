import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import chatService from '../../services/chat.service';
import authService from '../../services/auth.service';
import { Chat as ChatType, Message } from '../../services/chat.service';
import styles from './Chat.module.css';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Проверка авторизации
    if (!isAuthenticated) {
      navigate('/login', { state: { from: id ? `/chats/${id}` : '/chats' } });
      return;
    }

    // Получение информации о текущем пользователе
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    // Загрузка списка чатов
    const fetchChats = async () => {
      if (!isAuthenticated) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await chatService.getChats();
        setChats(data.chats || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Не удалось загрузить чаты');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [isAuthenticated, navigate, id]);

  // Загрузка сообщений при выборе чата
  useEffect(() => {
    const fetchMessages = async () => {
      if (id && isAuthenticated) {
        setIsLoading(true);
        try {
          const data = await chatService.getChat(Number(id));
          setMessages(data.messages || []);
          setError(null);
        } catch (err) {
          console.error('Error fetching messages:', err);
          setError('Не удалось загрузить сообщения');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [id, isAuthenticated]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !id) return;

    try {
      const response = await chatService.sendMessage(Number(id), { content: messageText });
      
      // Добавляем новое сообщение к списку
      if (response.message) {
        setMessages(prev => [...prev, response.message]);
      }
      
      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Не удалось отправить сообщение');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated) {
    return null; // Редирект на страницу логина выполняется в useEffect
  }

  return (
    <div className={styles.container}>
      <Header />
      {isLoading && !id ? (
        <div className={styles.loadingContainer}>
          <span className={styles.loadingText}>Загрузка чатов...</span>
        </div>
      ) : error && !id ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      ) : (
        <div className={styles.chatContainer}>
          <div className={styles.chatsList}>
            <h2 className={styles.chatTitle}>Сообщения</h2>
            {chats.length === 0 ? (
              <div className={styles.emptyChats}>
                <p>У вас пока нет сообщений</p>
                <Link to="/catalog" className={styles.browseCatalogLink}>
                  Найти что-нибудь интересное
                </Link>
              </div>
            ) : (
              chats.map((chat) => {
                // Определяем собеседника (не текущего пользователя)
                const otherUser = chat.users.find(user => user.id !== currentUser?.id) || chat.users[0];
                
                return (
                  <div 
                    key={chat.id} 
                    className={`${styles.chatItem} ${Number(id) === chat.id ? styles.active : ''}`}
                    onClick={() => navigate(`/chats/${chat.id}`)}
                  >
                    <img 
                      src={otherUser.avatar || 'https://via.placeholder.com/50?text=U'} 
                      alt={otherUser.name} 
                      className={styles.avatar} 
                    />
                    <div className={styles.chatInfo}>
                      <h3>{otherUser.name}</h3>
                      <p>{chat.lastMessage?.text || 'Нет сообщений'}</p>
                    </div>
                    {chat.lastMessage && (
                      <span className={styles.time}>
                        {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          {id ? (
            isLoading ? (
              <div className={styles.messagesContainer}>
                <div className={styles.loadingMessages}>
                  <span>Загрузка сообщений...</span>
                </div>
              </div>
            ) : error ? (
              <div className={styles.messagesContainer}>
                <div className={styles.errorMessages}>
                  <p>{error}</p>
                  <button 
                    className={styles.retryButton}
                    onClick={() => window.location.reload()}
                  >
                    Попробовать снова
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.messagesContainer}>
                <div className={styles.messagesHeader}>
                  {chats.find(chat => chat.id === Number(id)) && (
                    <>
                      <h2>
                        {chats.find(chat => chat.id === Number(id))?.users.find(
                          user => user.id !== currentUser?.id
                        )?.name || 'Диалог'}
                      </h2>
                      <div className={styles.listingInfo}>
                        {chats.find(chat => chat.id === Number(id))?.listingTitle || ''}
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.messagesList}>
                  {messages.length === 0 ? (
                    <div className={styles.emptyMessages}>
                      <p>Нет сообщений</p>
                      <p>Отправьте сообщение, чтобы начать диалог</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`${styles.message} ${message.senderId === currentUser?.id ? styles.ownMessage : styles.otherMessage}`}
                      >
                        <div className={styles.messageContent}>
                          <p>{message.text}</p>
                          <span className={styles.timestamp}>
                            {new Date(message.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className={styles.messageInputContainer}>
                  <textarea 
                    value={messageText} 
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение..."
                    className={styles.messageInput}
                  />
                  <button 
                    onClick={handleSendMessage} 
                    className={styles.sendButton}
                    disabled={!messageText.trim()}
                  >
                    Отправить
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className={styles.emptyState}>
              <h2>Выберите чат, чтобы начать общение</h2>
              {chats.length === 0 && (
                <p>У вас пока нет сообщений. Перейдите в каталог, чтобы найти интересные объявления.</p>
              )}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Chat; 