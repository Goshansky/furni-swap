import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import authService from "../../services/auth.service";
import userService, { User } from "../../services/user.service";
import listingService, { Listing } from "../../services/listing.service";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [userListings, setUserListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/profile' } });
            return;
        }

        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch user profile
                const userData = await userService.getProfile();
                setUser(userData);
                
                // Fetch user's listings
                // Note: This is a placeholder as the API might not support this yet
                // You would implement the real API call when available
                try {
                    // This is a simulated API call
                    // Replace with actual API call when available
                    // const listingsData = await listingService.getUserListings();
                    const mockListings: Listing[] = [
                        {
                            id: 1,
                            title: "Удобный диван",
                            description: "Отличный диван в хорошем состоянии",
                            price: 15000,
                            category: "Диваны и кресла",
                            location: "Москва",
                            condition: "хорошее",
                            userId: 1,
                            images: ["https://via.placeholder.com/300"],
                            mainImage: "https://via.placeholder.com/300",
                            createdAt: "2023-05-15T10:30:00Z",
                            updatedAt: "2023-05-15T10:30:00Z"
                        },
                        {
                            id: 2,
                            title: "Журнальный столик",
                            description: "Столик из натурального дерева",
                            price: 8000,
                            category: "Столы и стулья",
                            location: "Санкт-Петербург",
                            condition: "отличное",
                            userId: 1,
                            images: ["https://via.placeholder.com/300"],
                            mainImage: "https://via.placeholder.com/300",
                            createdAt: "2023-06-20T14:45:00Z",
                            updatedAt: "2023-06-20T14:45:00Z"
                        }
                    ];
                    
                    setUserListings(mockListings);
                } catch (listingError) {
                    console.error("Error fetching user listings:", listingError);
                    // Continue even if listings fail to load
                    setUserListings([]);
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [isAuthenticated, navigate]);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div>
                <Header />
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка профиля...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className={styles.profileContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.userCard}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Аватар" className={styles.userAvatar} />
                        ) : (
                            <div className={styles.userAvatarPlaceholder}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className={styles.userInfo}>
                            <h2 className={styles.userName}>{user?.name || 'Пользователь'}</h2>
                            <p className={styles.userDetail}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span>{user?.email || 'Нет данных'}</span>
                            </p>
                            <p className={styles.userDetail}>
                                <span className={styles.detailLabel}>Город:</span>
                                <span>{user?.city || 'Не указан'}</span>
                            </p>
                            <p className={styles.userDetail}>
                                <span className={styles.detailLabel}>Дата регистрации:</span>
                                <span>{user?.createdAt ? formatDate(user.createdAt) : 'Не указана'}</span>
                            </p>
                        </div>
                    </div>
                    <div className={styles.sidebarLinks}>
                        <Link to="/favorites" className={styles.sidebarLink}>
                            <span className={styles.linkIcon}>♥</span>
                            Избранное
                        </Link>
                        <Link to="/purchases" className={styles.sidebarLink}>
                            <span className={styles.linkIcon}>🛒</span>
                            История покупок
                        </Link>
                        <Link to="/chats" className={styles.sidebarLink}>
                            <span className={styles.linkIcon}>💬</span>
                            Сообщения
                        </Link>
                        <button 
                            className={styles.logoutButton}
                            onClick={() => {
                                authService.logout();
                                navigate('/login');
                            }}
                        >
                            Выйти
                        </button>
                    </div>
                </div>
                
                <div className={styles.content}>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                    
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Мои объявления</h2>
                            <Link to="/create-listing" className={styles.actionButton}>
                                Создать объявление
                            </Link>
                        </div>
                        
                        {userListings.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>У вас пока нет объявлений</p>
                                <Link to="/create-listing" className={styles.linkButton}>
                                    Создать первое объявление
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.listingsGrid}>
                                {userListings.map((listing) => (
                                    <div key={listing.id} className={styles.listingCard}>
                                        <div className={styles.listingImage}>
                                            <img src={listing.mainImage} alt={listing.title} />
                                        </div>
                                        <div className={styles.listingInfo}>
                                            <Link to={`/product/${listing.id}`} className={styles.listingTitle}>
                                                {listing.title}
                                            </Link>
                                            <p className={styles.listingPrice}>{listing.price.toLocaleString()} ₽</p>
                                            <p className={styles.listingDate}>
                                                Опубликовано: {formatDate(listing.createdAt)}
                                            </p>
                                        </div>
                                        <div className={styles.listingActions}>
                                            <button className={styles.editButton}>
                                                Редактировать
                                            </button>
                                            <button className={styles.deleteButton}>
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                    
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Недавние покупки</h2>
                            <Link to="/purchases" className={styles.viewAllLink}>
                                Смотреть все
                            </Link>
                        </div>
                        
                        <div className={styles.purchasesPreview}>
                            <div className={styles.emptyState}>
                                <p>История покупок пуста</p>
                                <Link to="/catalog" className={styles.linkButton}>
                                    Перейти в каталог
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
