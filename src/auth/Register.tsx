import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Auth.module.css";
import authService from "../services/auth.service";

const Register = () => {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !lastName || !email || !password || !city || !avatar) {
            setError("Пожалуйста, заполните все поля и загрузите фото");
            return;
        }
        
        try {
            await authService.register({
                name,
                last_name: lastName,
                email,
                password,
                city,
                avatar
            });
            navigate("/verify", { state: { email } });
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            setError("Ошибка регистрации. Пожалуйста, попробуйте еще раз.");
        }
    };

    return (
        <motion.div
            className={styles.authContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={styles.authTitle}>Регистрация</h2>
            <form className={`${styles.authBox} ${styles.authForm}`} onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Имя"
                    className={styles.authInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Фамилия"
                    className={styles.authInput}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.authInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    className={styles.authInput}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Город"
                    className={styles.authInput}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <div className={styles.fileInputContainer}>
                    <button 
                        type="button" 
                        className={styles.fileInputButton}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {avatar ? 'Фото выбрано' : 'Выберите фото профиля'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                        required
                    />
                </div>
                {avatar && (
                    <div className={styles.avatarPreview}>
                        <img 
                            src={URL.createObjectURL(avatar)} 
                            alt="Avatar preview" 
                            className={styles.avatarImage}
                        />
                    </div>
                )}
                {error && <p className={styles.errorText}>{error}</p>}
                <button type="submit" className={styles.authButton}>Зарегистрироваться</button>
            </form>
        </motion.div>
    );
};

export default Register;
