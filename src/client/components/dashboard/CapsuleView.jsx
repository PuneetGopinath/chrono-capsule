/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/dashboard/CapsuleView.jsx
 * License: MIT (see LICENSE)
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../Loading.jsx";

const sampleData = [
    {
        _id: "1",
        recipient: {
            name: "XXX",
            email: "XXX@XXX.com"
        },
        opened: false
    }
];
sampleData.push({ ...sampleData[0], _id: "2", opened: true });
sampleData.push({ ...sampleData[0], _id: "3" });

const Capsule = ({ capsule, id }) => {
    const d = new Date(capsule.unlockDate);
    return (
        <div className="capsule-card">
            <div className="capsule-top">
                <h2>📦 Capsule #{id}</h2>
                <span className={`capsule-status ${capsule.opened ? "unlocked" : "pending"}`}>
                    {capsule.opened ? "Unlocked" : "Pending"}
                </span>
            </div>
            <div className="capsule-details">
                <p><strong>Recipient:</strong> {capsule.recipient.name}</p>
                <p><strong>Email:</strong> {capsule.recipient.email}</p>
                <p><strong>Unlock Date:</strong> {d.toLocaleDateString()} {d.getHours()}:{d.getMinutes()}</p>
            </div>
        </div>
    );
};

export default function CapsuleView() {
    const navigate = useNavigate();

    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ capsules, setCapsules ] = useState([]);

    const fetchC = async () => {
        try {
            const res = await fetch("/api/capsules/view", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setCapsules(data);
            } else {
                console.log("Error fetching capsules [BACKEND]:", data.message);
                setError("Failed to fetch capsules." + (data?.message ? ` Error: ${data.message}` : " Please try again later."));
            }
        } catch (err) {
            console.log("Error fetching capsules [FRONTEND]:", err);
            setError("An unknown error occurred while fetching capsules. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            fetchC();
        }
    }, [loading]);

    return (
        <main>
            {loading
                ? (
                    <>
                        <Loading text="Fetching Capsules..." />
                        <div role="status" aria-live="polite" className="capsule-container">
                            {sampleData.map(c => (
                                <Capsule key={c._id} id={c._id} capsule={{ ...c, unlockDate: new Date().toISOString() }} />
                            ))}
                        </div>
                    </>
                )
                : (
                    error
                        ? (
                            <div className="error-container">
                                <h2>Error occurred!</h2>
                                <small>If the error persists after retrying few times, please logout and login again.</small>
                                <div className="error-msg">{error}</div>
                                <a className="auth-button" href="/dashboard/view">Retry</a>
                            </div>
                        )
                        : <>
                        <div className={`capsule-header${capsules.length > 0 ? "" : " empty"}`}>
                            {
                                capsules.length > 0
                                    ? <>
                                        <h1>Your Capsules</h1>
                                        <button aria-label="create-capsule" className="create-button top" onClick={() => navigate("/dashboard/create")}>Create a Capsule</button>
                                    </>
                                    : <>
                                        <h2>You have created no capsules so far.</h2>
                                        <button aria-label="create-capsule" className="create-button empty" onClick={() => navigate("/dashboard/create")}>Create a Capsule</button>
                                    </>
                            }
                        </div>
                        <div className="capsule-container">
                            {capsules.length > 0
                                && (
                                    capsules.map((c, i) => (
                                        <Capsule key={c._id} id={i + 1} capsule={{ ...c }} />
                                    ))
                                )
                            }
                        </div>
                    </>
                )
            }
        </main>
    );
};