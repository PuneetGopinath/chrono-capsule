// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/client/components/Verify.jsx
// License: MIT (see LICENSE)

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate as uuidValidate, version as uuidVersion } from "uuid";

const isValidUUID = (token) => {
    return uuidValidate(token) && uuidVersion(token) === 4;
};

export default function Verify() {
    const navigate = useNavigate();
    const { token } = useParams();

    const [ redirectSec, setRedirectSec ] = useState(5);
    const [ loading, setLoading ] = useState(true);
    const [ verified, setVerified ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ notice, setNotice ] = useState(null);
    const [ cooldown, setCooldown ] = useState(0);

    const loggedin = !!localStorage.getItem("token");

    const verify = async (token, signal) => {
        if (!isValidUUID(token)) {
            setLoading(false);
            return setError("Invalid verification token.");
        }

        try {
            const res = await fetch(`/api/auth/verify/${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                signal
            });
            const data = await res.json();
            if (res.ok) {
                setVerified(true);
            } else {
                setError(data || "Verification failed. Please try again.");
                console.log("Verification error:", data);
            }
        } catch (error) {
            console.log("Error during verification:", error);
            setError("Unexpected error occurred during verification.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async (event) => {
        event.preventDefault();
        setCooldown(30);
        if (loading || verified) return;

        const form = event.target;
        const formData = new FormData(form);
        const email = formData.get("email").trim().toLowerCase();

        if (!email && !loggedin)
            return setError("Email is required to resend verification.");
        
        if (!loggedin && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
            return setError("Invalid email format.");
        }

        try {
            const headers = {
                "Content-Type": "application/json",
                ...(loggedin && { "Authorization": `Bearer ${localStorage.getItem("token")}` })
            };
            const res = await fetch("/api/auth/resend", {
                method: "POST",
                headers,
                body: loggedin ? null : JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setError(null);
                setNotice("Verification email resent successfully. Please check your inbox.");
            } else {
                setError(data.message || "Something went wrong. Try resending the verification email.");
            }
        } catch (err) {
            console.log("Error resending verification email:", err);
            setError("Unexpected error occurred while resending verification email.");
        }
    };

    useEffect(() => {
        if (token) {
            const controller = new AbortController();
            verify(token, controller.signal);
            return () => controller.abort(); // Cleanup on unmount
        } else {
            setLoading(false);
            setError("No verification token provided.");
        }
    }, [token]);

    useEffect(() => {
        if (verified) {
            const interval = setInterval(() => {
                setRedirectSec(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        navigate("/");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [verified]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);
    // TODO: Add a live countdown of the cooldown timer

    return (
        <main>
                {loading ? (
                    <div className="center">
                    <h1>Verifying your account...</h1>
                    <div className="spinner"></div>
                    </div>
                )
                : error ? (
                    <>
                        <h1>Verification Failed</h1>
                        <p aria-live="polite">Error: {error?.message ?? error}</p>
                        <form onSubmit={handleResend} hidden={error?.verified ? true : false}>
                            <label htmlFor="email" className={loggedin ? "hide" : ""}>Enter your email to resend verification:</label>
                            <input type="email" name="email" placeholder="xyz@example.com" hidden={loggedin ? true : false} />
                            <button type="submit" disabled={cooldown > 0} className="auth-button">Resend Verification</button>
                            <p className={`cooldown${cooldown > 0 ? "" : " hide"}`}>Try again in {cooldown} seconds.</p>
                        </form>
                    </>
                )
                : notice ? (
                    <>
                        <h1>Verification Email Sent</h1>
                        <p className="notice" aria-live="polite">{notice}</p>
                    </>
                )
                : (
                    <>
                        <h1>✅ Your email has been verified!</h1>
                        <p aria-live="polite">Thank you for verifying your email.</p>
                        <a href="/" className="auth-button">Home</a>
                        <p>Redirecting to home in {redirectSec} seconds.</p>
                    </>
                )}
        </main>
    );
};