import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/Categories";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import listingService, { Listing } from "../../services/listing.service";
import styles from "./Home.module.css";

const Home = () => {
    const [popularProducts, setPopularProducts] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                setIsLoading(true);
                // Fetch listings sorted by newest (assuming most popular)
                const response = await listingService.getListings({
                    limit: 5,
                    page: 1
                });
                setPopularProducts(response.listings || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching popular products:', err);
                setError('Не удалось загрузить популярные товары');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPopularProducts();
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <Hero />
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>Категории</h2>
                    <Link to="/catalog" className={styles.viewAll}>
                        Смотреть все
                    </Link>
                </div>
                <Categories />
            </section>
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>Популярные товары</h2>
                    <Link to="/catalog" className={styles.viewAll}>
                        Смотреть все
                    </Link>
                </div>
                
                {isLoading ? (
                    <div className={styles.loading}>Загрузка товаров...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.products}>
                        {popularProducts.length > 0 ? (
                            popularProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    id={product.id}
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    location={product.location}
                                    imageUrl={product.mainImage}
                                />
                            ))
                        ) : (
                            <div className={styles.noProducts}>
                                Нет доступных товаров. <Link to="/create-listing">Создайте первое объявление</Link>
                            </div>
                        )}
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
};

export default Home;


