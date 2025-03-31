import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile.tsx";
import Login from "./auth/Login.tsx";
import Register from "./auth/Register.tsx";
import Verify from "./auth/Verify.tsx";
import Verify2fa from "./auth/Verify2fa.tsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/verify2fa" element={<Verify2fa />} />
            </Routes>
        </Router>
    );
};

export default App;
