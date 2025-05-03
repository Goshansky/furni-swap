import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile.tsx";
import Login from "./auth/Login.tsx";
import Register from "./auth/Register.tsx";
import Verify from "./auth/Verify.tsx";
import Verify2fa from "./auth/Verify2fa.tsx";
import Catalog from "./pages/Catalog/Catalog.tsx";
import Product from "./pages/Product/Product.tsx";
import Chat from "./pages/Chat/Chat.tsx";
import Favorites from "./pages/Favorites/Favorites.tsx";
import CreateListing from "./pages/CreateListing/CreateListing.tsx";
import InspirationDesign from "./pages/InspirationDesign/InspirationDesign.tsx";

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
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/chats" element={<Chat />} />
                <Route path="/chats/:id" element={<Chat />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/inspiration" element={<InspirationDesign />} />
            </Routes>
        </Router>
    );
};

export default App;
