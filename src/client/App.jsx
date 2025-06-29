import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import CapsuleForm from "./components/CapsuleForm";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CapsuleForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
};