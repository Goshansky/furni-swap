import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; 2025 Furni-swap. Все права защищены.</p>
                <nav className={styles.nav}>
                    <a href="/terms">Условия использования</a>
                    <a href="/privacy">Политика конфиденциальности</a>
                    <a href="/contact">Связаться с нами</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;

