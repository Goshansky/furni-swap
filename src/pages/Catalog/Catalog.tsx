import {useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Catalog.module.css";
import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";

const products = [
    {id: 1, name: "Диван", price: 200, category: "Мебель", image: "../../../public/images22.jpg"},
    {id: 2, name: "Стол", price: 100, category: "Мебель", image: "../../../public/images22.jpg"},
    {id: 3, name: "Кресло", price: 150, category: "Мебель", image: "../../../public/images22.jpg"},
    {id: 4, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"},
    {id: 5, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"},
    {id: 6, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"},
    {id: 7, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"},
    {id: 8, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"},
    {id: 9, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"},
    {id: 10, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"},
    {id: 11, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg"}
];

const categories = ["Все", "Мебель", "Освещение"];

const Catalog = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Все");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    const filteredProducts = products.filter(product =>
        (selectedCategory === "Все" || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);

    return (
        <div>
            <Header />

            <div className={styles.catalogContainer}>
                <h1 className={styles.title}>Каталог товаров</h1>

                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className={styles.filters}>
                    <select className={styles.filterButton} value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select className={styles.filterButton} value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Сначала дешевые</option>
                        <option value="desc">Сначала дорогие</option>
                    </select>
                </div>

                <div className={styles.productGrid}>
                    {filteredProducts.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            <img src={product.image} alt={product.name} className={styles.productImage}/>
                            <h2 className={styles.productName}>{product.name}</h2>
                            <p className={styles.productPrice}>${product.price}</p>
                            <button className={styles.buyButton}
                                    onClick={() => navigate(`/product/${product.id}`)}>Купить
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Catalog;
