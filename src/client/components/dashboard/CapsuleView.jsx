/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/dashboard/CapsuleView.jsx
 * License: MIT (see LICENSE)
*/

import { useState, useEffect } from "react";
import Loading from "../Loading.jsx";

const Capsule = ({ capsule, id }) => {
    const d = new Date(capsule.unlockDate);
    return (
        <div className="capsule-card">
            <div className="capsule-header">
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
    const [ loading, setLoading ] = useState(true);
    const [ capsules, setCapsules ] = useState([]);

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
    sampleData.push({ ...sampleData[0], _id: "2" });
    sampleData.push({ ...sampleData[0], _id: "3" });

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
            }
        } catch (err) {
            console.log("Error fetching capsules [FRONTEND]:", err);
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
                        <div className="capsule-container">
                            {sampleData.map(c => (
                                <Capsule key={c._id} id={c._id} capsule={{ ...c, unlockDate: new Date().toISOString() }} />
                            ))}
                        </div>
                    </>
                )
                : (
                    <div className="capsule-container">
                        {capsules.length > 0 ? capsules.map((c, i) => (
                            <Capsule key={c._id} id={i + 1} capsule={{ ...c }} />
                        )) : <h1>You have created no capsules so far.</h1>}
                    </div>
                )
            }
        </main>
    );
};