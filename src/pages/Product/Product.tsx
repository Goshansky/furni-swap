import { useParams } from "react-router-dom";
import styles from "./Product.module.css";

const products = [
    { id: 1, name: "Диван", price: 200, category: "Мебель", image: "../../../public/images22.jpg", description: "Удобный и стильный диван для вашей гостиной." },
    { id: 2, name: "Стол", price: 100, category: "Мебель", image: "../../../public/images22.jpg", description: "Крепкий деревянный стол для вашей кухни или кабинета." },
    { id: 3, name: "Кресло", price: 150, category: "Мебель", image: "../../../public/images22.jpg", description: "Эргономичное кресло для комфортного отдыха." },
    { id: 4, name: "Лампа", price: 50, category: "Освещение", image: "../../../public/images22.jpg", description: "Настольная лампа для уютного освещения." }
];

const Product = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === Number(id));

    if (!product) {
        return <h2 className={styles.notFound}>Товар не найден</h2>;
    }

    return (
        <div className={styles.productContainer}>
            <img src={product.image} alt={product.name} className={styles.productImage} />
            <div className={styles.productInfo}>
                <h1 className={styles.productTitle}>{product.name}</h1>
                <p className={styles.productPrice}>${product.price}</p>
                <p className={styles.productDescription}>{product.description}</p>
            </div>
            <div className={styles.productActions}>
                <button className={styles.buyButton} onClick={() => alert('Покупка совершена!')}>Купить</button>
                <button className={styles.contactButton} onClick={() => alert('Свяжитесь с продавцом!')}>Связаться по объявлению</button>
            </div>
        </div>
    );
};

export default Product;