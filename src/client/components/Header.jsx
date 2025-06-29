import { Link } from "react-router-dom";

export default function Header() {
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
        </header>
    );
};