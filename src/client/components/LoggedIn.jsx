// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/client/components/LoggedIn.jsx
// License: MIT (see LICENSE)

export default function LoggedIn({ text }) {
    return (
        <main>
            <h1>You're already logged in</h1>
            <p>{text}</p>
            <button className="auth-button" onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Redirect to login page
                // Since we are modifying localStorage, we have to reload the page to reflect the changes
            }}>Logout</button>
        </main>
    );
};