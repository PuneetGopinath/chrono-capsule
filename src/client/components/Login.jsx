/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/Login.jsx
 * License: MIT (see LICENSE)
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoggedIn from "./LoggedIn";

export default function Login({ data }) {
    const navigate = useNavigate();
    const { loggedIn, setLoggedIn } = data;
    if (loggedIn) {
        return <LoggedIn text="To login into another account, you have to logout" setLoggedIn={setLoggedIn} />;
    }

    const [ error, setError ] = useState(null);

    const [ showPwd, setShowPwd ] = useState(false);
    const toggleVisibility = () => {
        setShowPwd(!showPwd);
        if (showPwd) {
            document.querySelector(".view-button").type = "text";
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData.entries());
        console.log(obj);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            });
            const data = await res.json();

            if (res.ok) {
                alert("Logged in successfully!");
                console.log("[✅ Success] Logged in successfully!");
                localStorage.setItem("token", data.token);
                setLoggedIn(true);
                navigate("/"); // Redirect to home page
            } else {
                console.log("[❌ Error] Login failed:", data.message);
                setError(data.message || "Login failed. Please check your credentials.");
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.log("[❌ Error] Failed to login", err);
            setError("An error occured while trying to log in. Please try again later.");
            window.scrollTo(0, 0);
        }
    };

    return (
        <main>
            <div className="form-container login">
                <h2>Login</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        maxLength="30"
                        required
                        aria-required="true"
                    />

                    <label>Password:</label>
                    <div className="pwd-container">
                        <input
                            type={showPwd ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            required
                            aria-required="true"
                        />
                        <span className="view-button" title="Show/Hide Password" onClick={toggleVisibility}>👁</span>
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </main>
    );
};