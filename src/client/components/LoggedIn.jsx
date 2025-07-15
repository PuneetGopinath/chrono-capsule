/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/LoggedIn.jsx
 * License: MIT (see LICENSE)
*/

import { useNavigate } from "react-router-dom";

export default function LoggedIn({ text, setLoggedIn }) {
    const navigate = useNavigate();
    
    return (
        <main>
            <h1>You're already logged in</h1>
            <p>{text}</p>
            <button className="auth-button" onClick={() => {
                localStorage.removeItem("token");
                setLoggedIn(false);
                navigate("/login"); // Redirect to login page
                // Since we are modifying localStorage, we have to reload the page to reflect the changes
            }}>Logout</button>
        </main>
    );
};