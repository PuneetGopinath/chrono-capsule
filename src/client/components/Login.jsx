/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/Login.jsx
 * License: MIT (see LICENSE)
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import LoggedIn from "./LoggedIn";

import loadGoogleScript from "../utils/loadGoogleScript";

export default function Login({ data }) {
    const navigate = useNavigate();

    const [ submitting, setSubmitting ] = useState(false);
    const { loggedIn, setLoggedIn } = data;

    const [ error, setError ] = useState(null);

    const [ showPwd, setShowPwd ] = useState(false);
    const toggleVisibility = () => {
        setShowPwd(!showPwd);
        if (showPwd) {
            document.querySelector(".view-button").type = "text";
        }
    };

    if (loggedIn) {
        return <LoggedIn text="To login into another account, you have to logout" setLoggedIn={setLoggedIn} />;
    }

    useEffect(() => {
        loadGoogleScript()
            .then(() => {
                const container = document.querySelector(".google_signin");
                if (!container || !window.google) return;

                google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: googleSignIn
                });

                google.accounts.id.renderButton(
                    container,
                    { theme: "outline", size: "large", width: container.offsetWidth, text: "signin_with" }
                );

                console.log("[Info] Google Sign-In button rendered");
                google.accounts.id.prompt(); // One Tap dialog
            })
            .catch((err) => {
                console.error("[ERROR] Failed to load GIS script:", err);
                setError("If google sign in is required, please try again later.");
            });
    }, []);

    const googleSignIn = async (user) => {
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
                alert("Logged in through Google successfully!");
                console.log("[✅ Success] Logged in through Google successfully!");
                localStorage.setItem("token", data.token);
                setLoggedIn(true);
                navigate("/"); // Redirect to home page
            } else {
                console.log("[❌ Error] Login failed through google:", data.message);
                setError(data.message || "Login failed through google. Please try later.");
                window.scrollTo(0, 0);
            }
        } catch(err) {
            console.log("[❌ Error] Failed to login (through google)", err);
            setError("Unable to login through google. Please try again later.");
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

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
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main>
            <div className="form-container">
                <h2>Login</h2>
                {error && <div className="error-msg">{error}</div>}

                <div className="google_signin"></div>
                
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

                    <button type="submit" disabled={submitting}>Login</button>
                </form>
            </div>
        </main>
    );
};