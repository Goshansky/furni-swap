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
import Purchases from "./pages/Purchases/Purchases.tsx";
import Terms from "./pages/Terms/Terms.tsx";
import Privacy from "./pages/Privacy/Privacy.tsx";
import Contact from "./pages/Contact/Contact.tsx";

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
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/inspiration" element={<InspirationDesign />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
};

export default App;
