// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/client/components/Verify.jsx
// License: MIT (see LICENSE)

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { validate as uuidValidate, version as uuidVersion } from "uuid";

const isValidUUID = (token) => {
    return uuidValidate(token) && uuidVersion(token) === 4;
};

export default function Verify() {
    const { token } = useParams();

    const [ redirectSec, setRedirectSec ] = useState(5);
    const [ loading, setLoading ] = useState(true);
    const [ verified, setVerified ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ notice, setNotice ] = useState(null);

    const loggedin = !!localStorage.getItem("token");

    const verify = async (token) => {
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
            verify(token);
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
                        window.location.href = "/";
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [verified]);

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
                        <p>Error: {error?.message ?? error}</p>
                        <form onSubmit={handleResend} hidden={error?.verified ? true : false}>
                            <label htmlFor="email">Enter your email to resend verification:</label>
                            <input type="email" name="email" placeholder="xyz@example.com" hidden={loggedin ? true : false} />
                            <button type="submit">Resend Verification</button>
                        </form>
                    </>
                )
                : notice ? (
                    <p style={{ color: "green", fontSize: "1.1rem" }}>{notice}</p>
                )
                : (
                    <>
                        <h1>✅ Your email has been verified!</h1>
                        <p>Thank you for verifying your email.</p>
                        <a href="/" className="auth-button">Home</a>
                        <p>Redirecting to home in {redirectSec} seconds.</p>
                    </>
                )}
        </main>
    );
};