/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/NotLoggedIn.jsx
 * License: MIT (see LICENSE)
*/

import { useNavigate } from "react-router-dom";

export default function NotLoggedIn({ text }) {
    const navigate = useNavigate();

    return (
        <main>
            <h1>You're not logged in</h1>
            <p>{text}</p>
            <button className="auth-button" onClick={() => {
                navigate("/login"); // Redirect to login page
            }}>Login</button>
        </main>
    );
};