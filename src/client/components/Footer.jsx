/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/Footer.jsx
 * License: MIT (see LICENSE)
*/

import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <p>&copy; 2025 - {new Date().getFullYear()} Puneet Gopinath</p>
                <p>Time-locked thoughts from your present self</p>
                <p>v1.1.0 — built with curiosity by Puneet Gopinath</p>
            </div>

            <div className="footer-right">
                <Link to="/about">About</Link>
                <Link to="/terms">Terms & Conditions</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <a href="mailto:xxx@gmail.com">Contact</a>
            </div>
        </footer>
    );
};