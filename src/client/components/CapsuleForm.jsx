import { useState } from "react";

const suggestions = [
    { text: "1 Week", days: 7 },
    { text: "1 Month", days: 30 },
    { text: "6 Months", days: 182 },
    { text: "1 Year", days: 365 }
];

function SuggestDate({ text, days, setDate, isActive, setSelectedLabel }) {
    return <span className={`suggest-date${ isActive ? " active" : ""}`} title={`Unlocks in ${text.toLowerCase()} from today`} onClick={() => {
                const d = new Date();
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                d.setDate(d.getDate() + days);
                setDate(d);
                setSelectedLabel(text);
            }}>
                {text}
            </span>
}

export default function CapsuleForm() {
    const [message, setMessage] = useState("");
    const maxChars = 5000;

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust to local time
    //TODO: Validate that unlock date is at least 1 hour in the future
    const valD = new Date(now);
    valD.setFullYear(now.getFullYear() + 1); // Default unlock date is 1 year from now

    const [date, setDate] = useState(valD);

    const [ selectedLabel, setSelectedLabel ] = useState(null);

    return (
        <main>
            <div className="capsule-form">
                <h2>Create a capsule</h2>
                <form action="/api/capsules/create" method="POST">
                    <label>Recipient Name:</label>
                    <input
                        type="text"
                        placeholder="Enter recipient's name"
                        maxLength="64"
                    />

                    <label>Recipient Email:</label>
                    <input
                        type="email"
                        placeholder="Enter recipient's email"
                        maxLength="254"
                    />

                    <label>Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                        value={date.toISOString().slice(0, 16)}
                        onChange={(e) => setDate(new Date(e.target.value))}
                    />
                    <p className="suggest-label">Pick a quick future date from today ⏱️</p>
                    <div className="suggest-date-cont">
                        {suggestions.map(s => (
                            <SuggestDate
                                key={s.text}
                                text={s.text}
                                days={s.days}
                                setDate={setDate}
                                isActive={selectedLabel === s.text}
                                setSelectedLabel={setSelectedLabel}
                            />
                        ))}
                        { selectedLabel && (
                            <span
                                className="suggest-date reset-chip"
                                title="Reset selected suggestion to a year from now"
                                onClick={() => {
                                    setSelectedLabel(null);
                                    setDate(valD);
                                }}
                            >
                                Reset
                            </span>
                        )}
                    </div>

                    <button type="submit">Lock It In A Capsule</button>
                </form>
            </div>
        </main>
    );
};