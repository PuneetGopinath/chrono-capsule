// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/client/components/Verify.jsx
// License: MIT (see LICENSE)

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Verify() {
    const { token } = useParams();

    const [ loading, setLoading ] = useState(true);
    const [ verified, setVerified ] = useState(false);
    const [ error, setError ] = useState(null);
    const verify = async (token) => {
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
                setError(data.message || "Verification failed.");
                console.log("Verification error:", data);
            }
        } catch (error) {
            console.log("Error during verification:", error);
            setError("Unexpected error occurred during verification.");
        } finally {
            setLoading(false);
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

    return (
        <main>
            <h1>
                {loading ? "Verifying..."
                : error ? `Error: ${error}`
                : "✅ Your email has been verified!"}
            </h1>

            {verified && (
                <>
                    <p>Thank you for verifying your email. You can now log in.</p>
                    <a href="/login">Login</a>
                </>
            )}
        </main>
    );
};