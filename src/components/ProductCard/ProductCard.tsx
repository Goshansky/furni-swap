import { Button } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
    id: number;
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    imageUrl?: string;
    category?: string;
}

const ProductCard = ({ 
    id, 
    title = "Название товара", 
    description,
    price = 0,
    location = "",
    imageUrl = '',
    category = ""
}: ProductCardProps) => {
    const navigate = useNavigate();
    
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/product/${id}`);
    };
    
    // Truncate description to 100 characters
    const truncateDescription = (text: string, maxLength: number = 100) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.card}
            onClick={() => navigate(`/product/${id}`)}
            style={{ cursor: 'pointer' }}
        >
            <div className={styles.imageLink}>
                <img 
                    src={imageUrl || "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189af1d470e%20text%20%7B%20fill%3A%23888888%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189af1d470e%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22112.5%22%20y%3D%22106.5%22%3EНет фото%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"} 
                    alt={title} 
                    className={styles.image}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189af1d470e%20text%20%7B%20fill%3A%23888888%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189af1d470e%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22112.5%22%20y%3D%22106.5%22%3EНет фото%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                    }}
                />
                {category && <span className={styles.categoryBadge}>{category}</span>}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>
                    {title}
                </h3>
                {description && (
                    <p className={styles.description}>
                        {truncateDescription(description)}
                    </p>
                )}
                <div className={styles.details}>
                    <p className={styles.price}>{price.toLocaleString()} ₽</p>
                    <div className={styles.locationContainer}>
                        {location && <p className={styles.location}>{location}</p>}
                        {category && <p className={styles.category}>{category}</p>}
                    </div>
                </div>
                <Button 
                    type="primary" 
                    className={styles.button} 
                    onClick={handleButtonClick}
                >
                    Подробнее
                </Button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
