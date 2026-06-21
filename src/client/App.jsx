/**
 * © 2025-26 Puneet Gopinath. All rights reserved.
 * Filename: src/client/App.jsx
 * License: MIT (see LICENSE)
*/

import { BrowserRouter, Routes, Route } from "react-router";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import About from "./components/About";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Verify from "./components/Verify";

import CapsuleForm from "./components/dashboard/CapsuleForm";
import CapsuleView from "./components/dashboard/CapsuleView";

export default function App() {
    const [ signedIn, setSignedIn ] = useState(!!localStorage.getItem("token"));

    const savedTheme = () => localStorage.getItem("theme");
    useEffect(() => {
        if (savedTheme() === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }

        if (!localStorage.getItem("LastCheck")) {
            localStorage.setItem("LastCheck", Date.now());
        }

        const lastCheck = localStorage.getItem("LastCheck");

        if (signedIn && lastCheck < Date.now() - 5 * 60 * 60 * 1000) { // Last check should be more than 5 hours ago
            fetch(`/api/auth/status?token=${encodeURIComponent(localStorage.getItem("token"))}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.expired !== false) {
                        localStorage.removeItem("token");
                        window.location.reload();
                        console.log("Token has expired, user logged out.");
                    }
                    localStorage.setItem("LastCheck", Date.now());
                })
                .catch(err => {
                    console.log("Error fetching auth status:", err);
                });
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Header savedTheme={savedTheme} data={{ signedIn, setSignedIn }} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<SignUp data={{ signedIn, setSignedIn }} />} />
                    <Route path="/login" element={<SignIn data={{ signedIn, setSignedIn }} />} />
                    <Route path="/dashboard/create" element={<CapsuleForm data={{ signedIn }} />} />
                    <Route path="/dashboard/view" element={<CapsuleView data={{ signedIn }} />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/verify/:token" element={<Verify data={{ signedIn }} />} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
};