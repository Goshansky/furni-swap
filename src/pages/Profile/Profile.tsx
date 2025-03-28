import { motion } from "framer-motion";
import styles from "./Profile.module.css";
import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";

const Profile = () => {
    return (
        <div>
            <Header />
            <motion.div
                className={styles.profilePage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className={styles.content}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className={styles.title}>Профиль пользователя</h1>

                    <section className={styles.section}>
                        <h2>Мои объявления</h2>
                        <motion.div className={styles.itemsList}>
                            {["Диван", "Стол"].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.itemCard}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <p><strong>{item}</strong></p>
                                    <p>Цена: ${item === "Диван" ? "200" : "100"}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    <section className={styles.section}>
                        <h2>История покупок</h2>
                        <motion.div className={styles.itemsList}>
                            {["Шкаф", "Кресло"].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.itemCard}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <p><strong>{item}</strong></p>
                                    <p>Покупка: {item === "Шкаф" ? "10.03.2025" : "15.03.2025"}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                </motion.div>

                {/* Блок с профилем пользователя */}
                <motion.aside
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className={styles.sidebar}
                >
                    <img src="../../../public/images22.jpg" alt="Аватар" className={styles.avatar} />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className={styles.userInfo}
                    >
                        <p><strong>Имя:</strong> Иван Иванов</p>
                        <p><strong>Email:</strong> ivan@example.com</p>
                        <p><strong>Зарегистрирован:</strong> 01.01.2024</p>
                    </motion.div>
                </motion.aside>
            </motion.div>
            <Footer />
        </div>
    );
};

export default Profile;
