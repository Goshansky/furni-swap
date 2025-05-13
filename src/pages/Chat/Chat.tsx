import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import chatService from '../../services/chat.service';
import authService from '../../services/auth.service';
import { Chat as ChatType, Message } from '../../services/chat.service';
import styles from './Chat.module.css';
import React from 'react';
import { getFullImageUrl } from '../../services/api';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const isAuthenticated = authService.isAuthenticated();
  const messageListRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Проверка авторизации
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { state: { from: id ? `/chats/${id}` : '/chats' } });
      return;
    }

    // Получение информации о текущем пользователе
    const user = authService.getCurrentUser();
    console.log('Current user:', user);
    setCurrentUser(user);

    // Загрузка списка чатов
    const fetchChats = async () => {
      if (!isAuthenticated) {
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching chats...');
        const data = await chatService.getChats();
        console.log('Chats received:', data);
        
        if (data && Array.isArray(data.chats)) {
          setChats(data.chats.filter(chat => chat !== null && chat !== undefined));
          setError(null);
        } else {
          console.warn('No valid chats data returned from API:', data);
          setChats([]);
          setError('Не удалось загрузить список чатов');
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Не удалось загрузить чаты');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [isAuthenticated, navigate, id]);

  // Добавляем обработчик ресайза окна для поддержания скролла
  useEffect(() => {
    const handleResize = () => {
      // Обновляем скролл при изменении размера окна
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    };

    // Добавляем слушатель события
    window.addEventListener('resize', handleResize);
    
    // Удаляем слушатель при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Функция для скролла к последнему сообщению
  const scrollToBottom = (delay = 100) => {
    setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, delay);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    // Use setTimeout to ensure scroll happens after render
    scrollToBottom();
  }, [messages]);

  // Загрузка сообщений при выборе чата
  useEffect(() => {
    const fetchMessages = async () => {
      if (id && isAuthenticated) {
        setIsLoading(true);
        try {
          console.log(`Fetching messages for chat ID: ${id}`);
          const data = await chatService.getChat(Number(id));
          console.log('Messages received:', data);
          
          if (data && Array.isArray(data.messages)) {
            setMessages(data.messages.filter(msg => msg !== null && msg !== undefined));
            setError(null);
            
            // Scroll to bottom after loading messages - with timeout to ensure render is complete
            scrollToBottom(200);
          } else {
            console.warn('No valid messages returned from API:', data);
            setMessages([]);
            setError('Не удалось загрузить сообщения для выбранного чата');
          }
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
      setIsSending(true);
      console.log(`Sending message to chat ID: ${id}, text: ${messageText}`);
      const response = await chatService.sendMessage(Number(id), { content: messageText });
      console.log('Message sent, response:', response);
      
      // Добавляем новое сообщение к списку
      if (response && response.message) {
        setMessages(prev => [...prev, response.message]);
        setMessageText('');
        // Scroll to the bottom after adding new message
        scrollToBottom(100);
      } else if (response && typeof response === 'object') {
        // Fallback if message is directly in the response object
        const messageObj: Message = {
          id: response.id || Date.now(),
          chatId: Number(id),
          senderId: currentUser?.id,
          text: messageText,
          createdAt: response.createdAt || new Date().toISOString()
        };
        setMessages(prev => [...prev, messageObj]);
        setMessageText('');
        // Scroll to the bottom after adding new message
        scrollToBottom(100);
      } else {
        console.warn('No message data in response');
        setError('Сообщение отправлено, но не получен ответ от сервера');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Не удалось отправить сообщение');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Защита от рендеринга при отсутствии авторизации
  if (!isAuthenticated) {
    return null; // Редирект на страницу логина выполняется в useEffect
  }

  // Безопасно найти чат по ID
  const findChatById = (chatId: number): ChatType | null => {
    if (!Array.isArray(chats)) return null;
    return chats.find(chat => chat && typeof chat === 'object' && chat.id === chatId) || null;
  };

  // Безопасно получить другого пользователя из чата
  const getOtherUserInfo = (chat: ChatType) => {
    // If chat has users array, use it
    if (chat.users && Array.isArray(chat.users) && chat.users.length > 0) {
      const otherUser = chat.users.find(user => user && user.id !== currentUser?.id);
      if (otherUser) {
        return {
          id: otherUser.id,
          name: otherUser.name || 'Пользователь',
          avatar: otherUser.avatar
        };
      }
    }
    
    // Otherwise use other_user fields or determine from buyer/seller
    if (chat.other_user_id && chat.other_user_name) {
      return {
        id: chat.other_user_id,
        name: chat.other_user_name,
        avatar: null
      };
    }
    
    // Determine if current user is buyer or seller
    const currentUserId = currentUser?.id;
    if (chat.buyer_id && chat.seller_id) {
      const otherUserId = chat.buyer_id === currentUserId ? chat.seller_id : chat.buyer_id;
      return {
        id: otherUserId,
        name: chat.other_user_name || 'Пользователь',
        avatar: null
      };
    }
    
    // Fallback
    return {
      id: 0,
      name: 'Пользователь',
      avatar: null
    };
  };
  
  // Get chat title and image
  const getChatListingInfo = (chat: ChatType) => {
    return {
      title: chat.listing_title || chat.listingTitle || '',
      image: chat.image_url || chat.listingImage || null
    };
  };
  
  // Get last message info
  const getLastMessageInfo = (chat: ChatType) => {
    // If chat has lastMessage object
    if (chat.lastMessage && typeof chat.lastMessage === 'object') {
      return {
        text: chat.lastMessage.text || 'Нет сообщений',
        time: chat.lastMessage.createdAt || chat.created_at || ''
      };
    }
    
    // Otherwise use last_message fields
    return {
      text: chat.last_message || 'Нет сообщений',
      time: chat.last_message_time || chat.created_at || ''
    };
  };
  
  // Format date for displaying
  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if valid date
      if (isNaN(date.getTime())) {
        return 'Неизвестная дата';
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const messageDate = new Date(date);
      messageDate.setHours(0, 0, 0, 0); // Set to beginning of day
      
      // Check if the date is today
      if (messageDate.getTime() === today.getTime()) {
        return 'Сегодня';
      }
      
      // Check if the date is yesterday
      if (messageDate.getTime() === yesterday.getTime()) {
        return 'Вчера';
      }
      
      // For other dates, format as DD.MM.YYYY
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Неизвестная дата';
    }
  };
  
  // Group messages by date and sender
  const groupMessagesByDateAndSender = (messages: Message[]) => {
    // First group by date
    const groupedByDate: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      if (!message) return;
      
      const date = new Date(message.createdAt);
      const dateString = date.toDateString(); // Use date string as key
      
      if (!groupedByDate[dateString]) {
        groupedByDate[dateString] = [];
      }
      
      groupedByDate[dateString].push(message);
    });
    
    // Define interface for extended message with isConsecutive flag
    interface MessageWithFlag extends Message {
      isConsecutive?: boolean;
    }
    
    // Process each date group for consecutive sender messages
    const processedGroups: [string, MessageWithFlag[]][] = Object.entries(groupedByDate)
      .sort(([dateA], [dateB]) => {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .reverse() // Reverse to show oldest first
      .map(([dateString, messages]) => {
        // Tag consecutive messages
        const messagesWithConsecutiveFlag = messages.map((message, index) => {
          const isConsecutive = index > 0 && messages[index - 1]?.senderId === message.senderId;
          return { ...message, isConsecutive };
        });
        
        return [dateString, messagesWithConsecutiveFlag];
      });
    
    return processedGroups;
  };

  // Получаем текущий чат, если есть ID
  const currentChat = id ? findChatById(Number(id)) : null;

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
            {!Array.isArray(chats) || chats.length === 0 ? (
              <div className={styles.emptyChats}>
                <p>У вас пока нет сообщений</p>
                <Link to="/catalog" className={styles.browseCatalogLink}>
                  Найти что-нибудь интересное
                </Link>
              </div>
            ) : (
              chats.map((chat) => {
                if (!chat || typeof chat !== 'object') {
                  console.warn("Invalid chat object:", chat);
                  return null;
                }
                
                try {
                  // Get other user info, listing info, and last message safely
                  const otherUser = getOtherUserInfo(chat);
                  const listing = getChatListingInfo(chat);
                  const lastMessage = getLastMessageInfo(chat);
                  
                  return (
                    <div 
                      key={chat.id} 
                      className={`${styles.chatItem} ${Number(id) === chat.id ? styles.active : ''}`}
                      onClick={() => navigate(`/chats/${chat.id}`)}
                    >
                      <img 
                        src={otherUser.avatar 
                          ? (typeof otherUser.avatar === 'string' && (otherUser.avatar.startsWith('http://') || otherUser.avatar.startsWith('https://'))
                              ? otherUser.avatar
                              : getFullImageUrl(otherUser.avatar)) 
                          : 'https://via.placeholder.com/50?text=U'} 
                        alt={otherUser.name} 
                        className={styles.avatar} 
                      />
                      <div className={styles.chatInfo}>
                        <h3>{otherUser.name}</h3>
                        <p>{lastMessage.text}</p>
                      </div>
                      {lastMessage.time && (
                        <span className={styles.time}>
                          {new Date(lastMessage.time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      )}
                    </div>
                  );
                } catch (err) {
                  console.error("Error rendering chat item:", err, chat);
                  return null;
                }
              }).filter(Boolean) // Удаляем null элементы
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
                  {currentChat && (
                    <>
                      <h2>
                        {getOtherUserInfo(currentChat).name}
                      </h2>
                      <div className={styles.listingInfo}>
                        {getChatListingInfo(currentChat).title}
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.messagesList} ref={messageListRef}>
                  {!Array.isArray(messages) || messages.length === 0 ? (
                    <div className={styles.emptyMessages}>
                      <p>Нет сообщений</p>
                      <p>Отправьте сообщение, чтобы начать диалог</p>
                    </div>
                  ) : (
                    groupMessagesByDateAndSender(messages).map(([dateString, dateMessages]) => (
                      <div key={dateString}>
                        <div className={styles.messageDate}>
                          <span>{formatMessageDate(dateString)}</span>
                        </div>
                        {dateMessages.map((message, index) => {
                          if (!message || typeof message !== 'object') return null;
                          
                          // Get appropriate user for the avatar
                          const messageUser = message.senderId === currentUser?.id 
                            ? currentUser 
                            : currentChat && getOtherUserInfo(currentChat);
                          
                          // Get avatar URL
                          const avatarUrl = message.senderId !== currentUser?.id
                            ? (messageUser?.avatar 
                                ? (typeof messageUser.avatar === 'string' && (messageUser.avatar.startsWith('http://') || messageUser.avatar.startsWith('https://')) 
                                    ? messageUser.avatar 
                                    : getFullImageUrl(messageUser.avatar))
                                : 'https://via.placeholder.com/50?text=U')
                            : (currentUser?.avatar 
                                ? (typeof currentUser.avatar === 'string' && (currentUser.avatar.startsWith('http://') || currentUser.avatar.startsWith('https://'))
                                    ? currentUser.avatar
                                    : getFullImageUrl(currentUser.avatar))
                                : 'https://via.placeholder.com/50?text=Me');
                            
                          return (
                            <div 
                              key={message.id || `temp-${Date.now()}-${index}`} 
                              className={`${styles.message} ${message.senderId === currentUser?.id ? styles.ownMessage : styles.otherMessage} ${message.isConsecutive ? styles.consecutiveMessage : ''}`}
                            >
                              <img 
                                src={avatarUrl}
                                alt={message.senderId === currentUser?.id ? 'Вы' : 'Собеседник'} 
                                className={styles.messageAvatar} 
                              />
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
                          );
                        })}
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
                    disabled={!messageText.trim() || isSending}
                  >
                    {isSending ? 'Отправка...' : 'Отправить'}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className={styles.emptyState}>
              <h2>Выберите чат, чтобы начать общение</h2>
              {(!Array.isArray(chats) || chats.length === 0) && (
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