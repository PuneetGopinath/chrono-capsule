import { useState } from "react";

export default function Login() {
    const [ showPwd, setShowPwd ] = useState(false);
    const toggleVisibility = () => {
        setShowPwd(!showPwd);
        if (showPwd) {
            document.querySelector(".view-button").type = "text";
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData.entries());

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
                localStorage.setItem("token", data.token);
                window.location.href="/"; // Redirect to home page
            } else {
                console.log("[❌ Error] Login failed:", data.message);
                alert(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.log("[❌ Error] Failed to login", err);
            alert("An error occured while trying to log in. Please try again later.")
        }
    };

    return (
        <main>
            <div className="form-container login">
                <h2>Login</h2>
                <form action="/api/auth/login" method="POST" onSubmit={handleSubmit}>
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

                    <button type="submit">Login</button>
                </form>
            </div>
        </main>
    );
};