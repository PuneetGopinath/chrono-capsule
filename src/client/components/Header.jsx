import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const [ isDark, setIsDark ] = useState(true);

    const toggleTheme = () => {
        document.body.classList.toggle("dark");
        setIsDark(document.body.classList.contains("dark"));
    };

    return (
        <header className="header">
            <div className="brand">
                <Link to="/">Chrono Capsule ⏳</Link>
            </div>
            <nav className="nav-links">
                <Link to="/about">About</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
                <span className="icon" role="icon" aria-label="theme icon">
                    {isDark ? "☾" : "☀"}
                </span>
            </button>
        </header>
    );
};