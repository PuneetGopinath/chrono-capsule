/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/Login.jsx
 * License: MIT (see LICENSE)
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet";

import LoggedIn from "./LoggedIn";

export default function Login({ data }) {
    const navigate = useNavigate();

    const [ submitting, setSubmitting ] = useState(false);
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

    const googleSignIn = async (user) => {
        const id_token = user.getAuthResponse().id_token;
        const profile = user.getBasicProfile();
        const name = profile.getName();

        const username = name.replace(/ /g, "");

        const info = {
            id_token,
            username,
            signIn: "google"
        };

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Logged in successfully!");
                console.log("[✅ Success] Logged in successfully!");
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
            <Helmet>
                <script src="https://apis.google.com/js/platform.js" async defer></script>
                <meta name="google-signin-client_id" content="453634898397-g4e2laccsk4lt5kv2p5urnrqvr4c3dr8.apps.googleusercontent.com" />
            </Helmet>
            <div className="form-container">
                <h2>Login</h2>
                {error && <div className="error-msg">{error}</div>}
                <div className="g-signin2 google-signin" data-onsuccess={googleSignIn}></div>
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