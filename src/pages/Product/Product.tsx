import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import listingService, { Listing } from "../../services/listing.service";
import chatService from "../../services/chat.service";
import authService from "../../services/auth.service";
import styles from "./Product.module.css";

const Product = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            
            try {
                setIsLoading(true);
                const data = await listingService.getListing(Number(id));
                
                if (data && data.listing) {
                    // Ensure we have full data from the API
                    console.log("Product data received:", data.listing);
                    setProduct(data.listing);
                    
                    // Check if the listing is in favorites if user is authenticated
                    if (isAuthenticated) {
                        try {
                            const favoriteData = await listingService.checkFavorite(Number(id));
                            setIsFavorite(favoriteData.isFavorite || false);
                        } catch (err) {
                            console.error("Error checking favorite status:", err);
                        }
                    }
                    
                    setError(null);
                } else {
                    setError("Не удалось получить данные о товаре");
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError("Не удалось загрузить информацию о товаре");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id, isAuthenticated]);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/product/${id}` } });
            return;
        }

        if (!product) return;

        try {
            if (isFavorite) {
                await listingService.removeFromFavorites(product.id);
            } else {
                await listingService.addToFavorites(product.id);
            }
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    const handleContact = async () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/product/${id}` } });
            return;
        }

        if (!product) return;

        try {
            // Show loading indicator or disable button during chat creation
            setIsLoading(true);
            
            console.log("Creating chat for listing:", product.id);
            const chatData = await chatService.createChat({
                listing_id: product.id,
                message: "Здравствуйте, это объявление еще актуально?"
            });
            
            console.log("Chat creation response:", chatData);
            
            if (chatData && chatData.chat && chatData.chat.id) {
                console.log("Navigating to chat:", chatData.chat.id);
                // Give time for API operations to complete before navigating
                setTimeout(() => {
                    navigate(`/chats/${chatData.chat.id}`);
                }, 300);
            } else {
                console.error("Chat created but no chat ID returned:", chatData);
                // Navigate to chats page anyway as fallback
                setTimeout(() => {
                    navigate('/chats');
                }, 300);
            }
        } catch (err) {
            console.error("Error creating chat:", err);
            // Show error message to user
            setError("Не удалось создать чат с продавцом. Пожалуйста, попробуйте позже.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loadingContainer}>
                    <span className={styles.loadingText}>Загрузка товара...</span>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.errorContainer}>
                    <h2 className={styles.notFound}>
                        {error || "Товар не найден"}
                    </h2>
                    <button 
                        onClick={() => navigate("/catalog")}
                        className={styles.backButton}
                    >
                        Вернуться в каталог
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.productContainer}>
                <div className={styles.imageContainer}>
                    <img 
                        src={product.mainImage || "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189af1d470e%20text%20%7B%20fill%3A%23888888%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189af1d470e%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22150%22%20y%3D%22150%22%3EНет фото%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"} 
                        alt={product.title} 
                        className={styles.productImage} 
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189af1d470e%20text%20%7B%20fill%3A%23888888%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189af1d470e%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22150%22%20y%3D%22150%22%3EНет фото%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                        }}
                    />
                </div>
                <div className={styles.productInfo}>
                    <h1 className={styles.productTitle}>{product.title}</h1>
                    <p className={styles.productPrice}>{product.price.toLocaleString()} ₽</p>
                    <p className={styles.productLocation}>{product.location || 'Местоположение не указано'}</p>
                    <div className={styles.productDetails}>
                        <p className={styles.productCondition}>
                            <strong>Состояние:</strong> {product.condition || 'Не указано'}
                        </p>
                        <p className={styles.productCategory}>
                            <strong>Категория:</strong> {product.category || 'Не указана'}
                        </p>
                    </div>
                    <div className={styles.productDescription}>
                        <h3>Описание</h3>
                        <p>{product.description || 'Описание отсутствует'}</p>
                    </div>
                </div>
                <div className={styles.productActions}>
                    <button 
                        className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
                        onClick={handleToggleFavorite}
                    >
                        {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                    </button>
                    <button 
                        className={styles.contactButton} 
                        onClick={handleContact}
                    >
                        Связаться с продавцом
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Product;