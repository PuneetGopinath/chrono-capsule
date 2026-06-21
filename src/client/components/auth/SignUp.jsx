/**
 * © 2025-26 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/SignUp.jsx
 * License: MIT (see LICENSE)
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import LoggedIn from "../LoggedIn";

import loadGoogleScript from "../../utils/loadGoogleScript";

// Redundant regexes copied from sanitize.js
const usernameRegex = /[^A-Za-z0-9\._\-@]/g;

export default function SignUp({ data }) {
    const { loggedIn, setLoggedIn } = data;

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

    useEffect(() => {
        loadGoogleScript()
            .then(() => {
                const container = document.querySelector(".google_signup");
                if (!container || !window.google) return;

                google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: googleSignUp
                });

                google.accounts.id.renderButton(
                    container,
                    { theme: "outline", size: "large", width: container.offsetWidth, text: "signup_with" }
                );

                console.log("[Info] Google Sign-Up button rendered");
                google.accounts.id.prompt(); // One Tap dialog
            })
            .catch((err) => {
                console.error("[ERROR] Failed to load GIS script:", err);
                setError("If google sign up is required, please try again later.");
            });
    }, []);
    
    if (loggedIn) {
        return <LoggedIn text="To register a new account, you have to logout" setLoggedIn={setLoggedIn} />;
    }

    const signin = async (username, password) => {
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
                console.log("[✅ Success] Signed in successfully!");
            } else {
                console.log("[❌ Error] Sign in failed:", data.message);
            }
        } catch (err) {
            console.log("[❌ Error] Failed to sign in", err);
        }
    };

    const googleSignUp = async (user) => {
        const credential = user.credential;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    // "Referrer-Policy": "no-referrer-when-downgrade" ONLY IF LOCALHOST
                },
                body: JSON.stringify({
                    credential,
                    signIn: "google"
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signed up through google successfully!");
                console.log("[✅ Success] Signed up through google successfully!");
                localStorage.setItem("token", data.token);
                setLoggedIn(true);
                navigate("/"); // Redirect to home page
            } else {
                console.log("[❌ Error] Signed up failed through google:", data.message);
                setError(data.message || "Signed up failed through google. Please try later.");
                window.scrollTo(0, 0);
            }
        } catch(err) {
            console.log("[❌ Error] Failed to sign up (through google)", err);
            setError("Unable to sign up through google. Please try again later.");
            window.scrollTo(0, 0);
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
                alert("Signed up successfully!");
                console.log("[✅ Success] Signed up successfully!");
                await signin(obj.username, obj.password);
                navigate("/"); // Redirect to home page
            } else {
                console.log("[❌ Error] Sign up failed:", data.message);
                setError(data.message || "Sign up failed. Please try again later.");
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.log("[❌ Error] Failed to sign up", err);
            setError("An error occurred while trying to sign up. Please try again later.");
            window.scrollTo(0, 0);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main>
            <div className="form-container">
                <h2>Sign Up</h2>
                {error && <div className="error-msg">{error}</div>}
                <div className="google_signup"></div>
                <hr />
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

                    <button type="submit" disabled={submitting}>Sign Up</button>
                </form>
            </div>
        </main>
    );
};