import { useState } from "react";

export default function CapsuleForm() {
    const [message, setMessage] = useState("");
    const maxChars = 5000;
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust to local time
    const valueDate = new Date(now);
    valueDate.setFullYear(now.getFullYear() + 1); // Default unlock date is 1 year from now

    return (
        <div className="capsule-form">
            <h2>Create a capsule</h2>
            <form action="/api/capsules/create" method="POST">
                <label>Recipient Name:</label>
                <input
                    type="text"
                    placeholder="Enter recipient's name"
                    maxLength="50"
                />

                <label>Recipient Email:</label>
                <input
                    type="text"
                    placeholder="Enter recipient's email"
                    maxLength="50"
                />

                <label>Message:</label>
                <textarea
                    value={message}
                    placeholder="Write your message to the future..."
                    maxLength={maxChars}
                    rows="6"
                />
                <div>{message.length}/{maxChars} characters</div>

                <label>Media Upload (max 10):</label>
                <input
                    type="file"
                    multiple
                    accept="image/*, video/*, audio/*"
                />

                <label>Unlock Date:</label>
                <input
                    type="datetime-local"
                    min={now.toISOString().slice(0, 16)}
                    value={valueDate.toISOString().slice(0, 16)}
                />

                <button type="submit">Lock It In A Capsule</button>
            </form>
        </div>
    );
};