/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/Register.jsx
 * License: MIT (see LICENSE)
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoggedIn from "./LoggedIn";

// Redundant regexes copied from sanitize.js
const usernameRegex = /[^A-Za-z0-9\._\-@]/g;

export default function Register({ data }) {
    const { loggedIn, setLoggedIn } = data;
    if (loggedIn) {
        return <LoggedIn text="To register a new account, you have to logout" setLoggedIn={setLoggedIn} />;
    }

    const navigate = useNavigate();

    const [ submitting, setSubmitting ] = useState(false);

    const [ error, setError ] = useState(null);

    const [ showPwd, setShowPwd ] = useState(false);
    const [ showConfirmPwd, setShowConfirmPwd ] = useState(false);
    const toggleVisibility = (e) => {
        if (e.target.id === "password")
            setShowPwd(!showPwd);
        else
            setShowConfirmPwd(!showConfirmPwd);
    };

    const login = async (username, password) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                setLoggedIn(true);
                console.log("[✅ Success] Logged in successfully!");
            } else {
                console.log("[❌ Error] Login failed:", data.message);
            }
        } catch (err) {
            console.log("[❌ Error] Failed to login", err);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const form = event.target;
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData.entries());

        if (usernameRegex.test(obj.username.normalize("NFKC"))) {
            window.scrollTo(0, 0);
            setSubmitting(false);
            return setError("Username contains invalid characters. Only alphabets, numbers, dots, underscores, hyphens, and @ are allowed.");
        }

        if (obj.password !== obj.confirmPassword) {
            setSubmitting(false);
            setError("Passwords do not match. Please try again.");
            return window.scrollTo(0, 0);
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            });
            const data = await res.json();

            if (res.ok) {
                alert("Registered successfully!");
                console.log("[✅ Success] Registered successfully!");
                await login(obj.username, obj.password);
                navigate("/"); // Redirect to home page
            } else {
                console.log("[❌ Error] Register failed:", data.message);
                setError(data.message || "Registration failed. Please check your credentials.");
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.log("[❌ Error] Failed to register", err);
            setError("An error occurred while trying to register. Please try again later.");
            window.scrollTo(0, 0);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main>
            <div className="form-container login">
                <h2>Register</h2>
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

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        maxLength="254"
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
                        <span className="view-button" id="password" title="Show/Hide Password" onClick={toggleVisibility}>👁</span>
                    </div>

                    <label>Confirm Password:</label>
                    <div className="pwd-container">
                        <input
                            type={showConfirmPwd ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            required
                            aria-required="true"
                        />
                        <span className="view-button" id="confirmPassword" title="Show/Hide Confirm Password" onClick={toggleVisibility}>👁</span>
                    </div>

                    <button type="submit" disabled={submitting}>Register</button>
                </form>
            </div>
        </main>
    );
};