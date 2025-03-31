import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Auth.module.css";
import { login } from "../services/authService";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Введите email и пароль");
            return;
        }
        try {
            await login(email, password);
            navigate("/verify2fa", { state: { email } }); // Передаем email
        } catch {
            setError("Ошибка входа");
        }
    };

    return (
        <motion.div
            className={styles.authContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={styles.authTitle}>Вход</h2>
            <form className={`${styles.authBox} ${styles.authForm}`} onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.authInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    className={styles.authInput}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
                <button type="submit" className={styles.authButton}>Войти</button>
            </form>
        </motion.div>
    );
};

export default Login;
