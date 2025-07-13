// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/client/Header.jsx
// License: MIT (see LICENSE)

import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const loggedIn = !!localStorage.getItem("token");
    const [ isDark, setIsDark ] = useState(true);

    const toggleTheme = () => {
        const is_dark = document.body.classList.toggle("dark");
        setIsDark(is_dark);
        localStorage.setItem("theme", is_dark ? "dark" : "light");
    };

    return (
        <header className="header">
            <div className="brand">
                <Link to="/">Chrono Capsule ⏳</Link>
            </div>
            <nav className="nav-links">
                <Link to="/about">About</Link>
                    {loggedIn ? <><Link to="/dashboard/create">Create Capsule</Link><button onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}>Logout</button></> : <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
            </nav>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
                <span className="icon" role="icon" aria-label="theme icon">
                    {isDark ? "☾" : "☀"}
                </span>
            </button>
        </header>
    );
};