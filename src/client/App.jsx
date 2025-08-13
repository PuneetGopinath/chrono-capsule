/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/App.jsx
 * License: MIT (see LICENSE)
*/

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

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
import CapsuleView from "./components/dashboard/CapsuleView";

export default function App() {
    const [ loggedIn, setLoggedIn ] = useState(!!localStorage.getItem("token"));

    const savedTheme = () => localStorage.getItem("theme");
    useEffect(() => {
        if (savedTheme() === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }

        const lastCheck = localStorage.getItem("LastCheck");

        if (loggedIn && lastCheck < Date.now() - 5 * 60 * 60 * 1000) { // Last check should be more than 5 hours ago
            fetch("/api/auth/status", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: localStorage.getItem("token") })
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.expired !== false) {
                        localStorage.removeItem("token");
                        window.location.reload();
                    }
                    localStorage.setItem("LastCheck", Date.now());
                })
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Header savedTheme={savedTheme} data={{ loggedIn, setLoggedIn }} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<Register data={{ loggedIn, setLoggedIn }} />} />
                    <Route path="/login" element={<Login data={{ loggedIn, setLoggedIn }} />} />
                    <Route path="/dashboard/create" element={<CapsuleForm data={{ loggedIn }} />} />
                    <Route path="/dashboard/view" element={<CapsuleView data={{ loggedIn }} />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/verify/:token" element={<Verify data={{ loggedIn }} />} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
};