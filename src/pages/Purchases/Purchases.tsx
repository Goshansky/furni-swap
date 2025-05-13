import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import purchaseService, { Purchase } from '../../services/purchase.service';
import authService from '../../services/auth.service';
import styles from './Purchases.module.css';

const Purchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/purchases' } });
      return;
    }

    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        const data = await purchaseService.getPurchases();
        setPurchases(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setError("Не удалось загрузить историю покупок. Пожалуйста, попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [isAuthenticated, navigate]);

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'processing':
        return styles.statusProcessing;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  // Function to get status in Russian
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'processing':
        return 'В обработке';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  // Sample data for preview when API is not ready
  const samplePurchases: Purchase[] = [
    {
      id: 1,
      listing_id: 101,
      title: 'Удобный диван',
      price: 15000,
      image: 'https://via.placeholder.com/150',
      seller_name: 'Иван Петров',
      category: 'Диваны и кресла',
      purchase_date: '2023-07-15T12:30:00Z',
      status: 'completed'
    },
    {
      id: 2,
      listing_id: 102,
      title: 'Кухонный стол',
      price: 8500,
      image: 'https://via.placeholder.com/150',
      seller_name: 'Анна Смирнова',
      category: 'Столы и стулья',
      purchase_date: '2023-08-20T15:45:00Z',
      status: 'processing'
    },
    {
      id: 3,
      listing_id: 103,
      title: 'Книжный шкаф',
      price: 12000,
      image: 'https://via.placeholder.com/150',
      seller_name: 'Сергей Иванов',
      category: 'Шкафы и комоды',
      purchase_date: '2023-09-05T10:15:00Z',
      status: 'completed'
    }
  ];

  // Use sample data when the API returns empty array
  const displayPurchases = purchases.length > 0 ? purchases : samplePurchases;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Загрузка истории покупок...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.purchasesHeader}>
          <h1>История покупок</h1>
          <Link to="/catalog" className={styles.browseButton}>
            Перейти в каталог
          </Link>
        </div>
        
        {error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Попробовать снова
            </button>
          </div>
        ) : displayPurchases.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>У вас пока нет покупок</h2>
            <p>После покупки товаров здесь появится история ваших заказов</p>
            <Link to="/catalog" className={styles.linkButton}>
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className={styles.purchasesList}>
            {displayPurchases.map((purchase) => (
              <div key={purchase.id} className={styles.purchaseCard}>
                <div className={styles.purchaseImage}>
                  <img src={purchase.image} alt={purchase.title} />
                </div>
                <div className={styles.purchaseInfo}>
                  <Link to={`/product/${purchase.listing_id}`} className={styles.purchaseTitle}>
                    {purchase.title}
                  </Link>
                  <p className={styles.purchasePrice}>{purchase.price.toLocaleString()} ₽</p>
                  <p className={styles.purchaseCategory}>{purchase.category}</p>
                  <p className={styles.purchaseSeller}>Продавец: {purchase.seller_name}</p>
                </div>
                <div className={styles.purchaseMeta}>
                  <p className={styles.purchaseDate}>
                    Дата покупки: {formatDate(purchase.purchase_date)}
                  </p>
                  <div className={styles.purchaseStatus}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Purchases; 