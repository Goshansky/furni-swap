import { Link } from "react-router-dom";
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <h1 className={styles.logo}>Furni-swap</h1>
                <h2 className={styles.logo}>Покупайте и продавайте с комфортом!</h2>
                <nav className={styles.nav}>
                    <Link to="/catalog" className={styles.navButton}>Каталог</Link>
                    <Link to="/sell" className={styles.navButton}>Продать</Link>
                    <Link to="/profile" className={styles.navButton}>Профиль</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;