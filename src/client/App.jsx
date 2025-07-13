/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/App.jsx
 * License: MIT (see LICENSE)
*/

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import About from "./components/About";
import Register from "./components/Register";
import Login from "./components/Login";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Verify from "./components/Verify";

import CapsuleForm from "./components/dashboard/CapsuleForm";

export default function App() {
    let savedTheme = localStorage.getItem("theme");
    useEffect(() => {
        savedTheme = localStorage.getItem("theme");

        if (savedTheme === "light") {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Header savedTheme={savedTheme}/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard/create" element={<CapsuleForm />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/verify/:token" element={<Verify />} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
};