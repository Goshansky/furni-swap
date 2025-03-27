import { Button } from "antd";
import { motion } from "framer-motion";
import styles from "./ProductCard.module.css";

const ProductCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.card}
        >
            <div className={styles.image}></div>
            <h3 className={styles.title}>Название товара</h3>
            <p className={styles.description}>Описание товара</p>
            <p className={styles.price}>$100</p>
            <Button type="primary" className={styles.button}>Купить</Button>
        </motion.div>
    );
};

export default ProductCard;
