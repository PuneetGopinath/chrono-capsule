// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/client/components/Footer.jsx
// License: MIT

import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <p>&copy; {new Date().getFullYear()} Puneet Gopinath</p>
                <p>Time-locked thoughts from your present self</p>
            </div>

            <div className="footer-right">
                <Link to="/about">About</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
                <a href="mailto:puneet.26g@gmail.com">Contact</a>
            </div>
        </footer>
    );
};