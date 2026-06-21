/**
 * © 2025-26 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/Home.jsx
 * License: MIT (see LICENSE)
*/

import { useNavigate } from "react-router";

import "../styles/home.css";

export default function Home() {
    const loggedin = !!localStorage.getItem("token");
    const navigate = useNavigate();

    return (
        <main>
            <div className="hero-image">
                <h1>Chrono Capsule</h1>
                <h5 className="tagline">Preserve a moment. Deliver it to the future</h5>
                <button
                    className="main-button"
                    onClick={() => {
                        if (loggedin)
                            navigate("/dashboard/view");
                        else
                            navigate("/register");
                    }}
                >
                    {loggedin ? "Go to Dashboard" : "Get Started"}
                </button>
            </div>
            <strong>How it works?</strong>
            <ol>
                <li>Write your message and attach your media</li>
                <li>Create the capsule</li>
                <li>Time travels and auto unlocks on specified date</li>
            </ol>
            <h3>What is Chrono Capsule?</h3>
            <p className="text">
                Chrono Capsule is a secure, encrypted platform for sending messages and media to the future. 
                Whether it's a birthday wish, a letter to your future self, or a message for a loved one, 
                Chrono Capsule ensures your words are preserved and delivered at the right time.
            </p>
        </main>
    );
};