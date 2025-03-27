import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/Categories";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard.tsx";
import styles from "./Home.module.css";

const Home = () => {
    return (
        <div className={styles.container}>
            <Header />
            <Hero />
            <section className={styles.section}>
                <h2 className={styles.title}>Категории</h2>
                <Categories />
            </section>
            <section className={styles.section}>
                <h2 className={styles.title}>Популярные товары</h2>
                <div className={styles.products}>
                    {[1, 2, 3, 4, 5].map((item) => (
                        <ProductCard key={item} />
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;


