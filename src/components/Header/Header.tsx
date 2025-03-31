import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src="/public/logo.jpg" alt="Furni-swap" className={styles.logoImage} />
                </Link>
                <Link to={'/'}>
                    <h1 className={styles.logo}>Furni-Swap</h1>
                </Link>

                <h2 className={styles.logo}>Покупайте и продавайте с комфортом!</h2>
                <nav className={styles.nav}>
                    <Link to="/catalog" className={styles.navButton}>Каталог</Link>
                    <Link to="/sell" className={styles.navButton}>Продать</Link>
                    <Link to="/register" className={styles.navButton}>Профиль</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;