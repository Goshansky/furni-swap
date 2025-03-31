import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Auth.module.css";
import { verify2faCode } from "../services/authService";

const Verify = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем email из state
    const email = location.state?.email || "";

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) {
            setError("Введите код");
            return;
        }
        try {
            await verify2faCode(email, code);
            navigate("/"); // Или нужная страница после верификации
        } catch {
            setError("Неверный код или ошибка сервера");
        }
    };

    return (
        <motion.div
            className={styles.authContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={styles.authTitle}>Подтверждение</h2>
            <form className={`${styles.authBox} ${styles.authForm}`} onSubmit={handleVerify}>
                <input
                    type="text"
                    placeholder="Введите код"
                    className={styles.authInput}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
                <button type="submit" className={styles.authButton}>Подтвердить</button>
            </form>
        </motion.div>
    );
};

export default Verify;