import { motion } from "framer-motion";
import styles from "./Categories.module.css";

const categories = ["Диваны", "Столы", "Шкафы", "Кресла"];

const Categories = () => {
    return (
        <div className={styles.gridContainer}>
            {categories.map((category, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className={styles.categoryCard}
                >
                    {category}
                </motion.div>
            ))}
        </div>
    );
};

export default Categories;
