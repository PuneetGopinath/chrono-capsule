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
    const min = new Date(now);
    min.setHours(min.getHours() + 1); // Minimum unlock date is 1 hour from now
    const valD = new Date(now);
    valD.setFullYear(now.getFullYear() + 1); // Default unlock date is 1 year from now

    const [date, setDate] = useState(valD);

    const [ mediaLinks, setMediaLinks ] = useState([
        {
            path: ""
        }
    ]);

    const [ selectedLabel, setSelectedLabel ] = useState(null);

    const [ fadeReset, setFadeReset ] = useState(false);
    const handleReset = () => {
        setFadeReset(true);
        setTimeout(() => {
            setSelectedLabel(null);
            setDate(valD);
            setFadeReset(false);
        }, 200);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent refreshing the page

        const form = event.target;
        const formData = new FormData(form);

        if (new Date(formData.get("unlockDate") < min)) {
            return alert("Unlock Date must be at least 1 hour from now.");
        }

        try {
            console.log(formData);
            const res = await fetch("/api/capsules/create", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });
            const data = await res.json();

            if (res.ok) {
                alert("Capsule created successfully!");
                form.reset(); // Reset the form
                setMessage("");
                setDate(valD);
                setSelectedLabel(null);
            } else {
                alert("Error creating capsule");
                console.log("[❌ Error] details:", data);
            }
        } catch (err) {
            console.log("[❌ Error] Failed to create capsule:", err);
        }
    }

    const handleDateChange = (e) => {
        const d = new Date(e.target.value);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setDate(d);
        setSelectedLabel(null);
    };

    return (
        <main>
            <div className="capsule-form">
                <h2>Create a capsule</h2>
                <form action="/api/capsules/create" method="POST" onSubmit={handleSubmit}>
                    <label>Recipient Name:</label>
                    <input
                        type="text"
                        name="recipient"
                        placeholder="Enter recipient's name"
                        maxLength="64"
                        required
                        aria-required="true"
                    />

                    <label>Recipient Email:</label>
                    <input
                        type="email"
                        name="recipientEmail"
                        placeholder="Enter recipient's email"
                        maxLength="254"
                        required
                        aria-required="true"
                    />

                    <label>Message:</label>
                    <textarea
                        value={message}
                        name="message"
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message to the future..."
                        maxLength={maxChars}
                        rows="6"
                        required
                        aria-required="true"
                    />
                    <div>{message.length}/{maxChars} characters</div>

                    <label>Media Links (max 10):</label>
                    {mediaLinks.map((obj, index) => {
                        return (<input
                            key={index}
                            type="text"
                            name={`media${index}`}
                            placeholder={`Media Link ${index + 1}`}
                            value={obj.path}
                            onChange={(e) => {
                                const updatedLinks = [...mediaLinks];
                                updatedLinks[index].path = e.target.value;
                                setMediaLinks(updatedLinks);
                            }}
                        />);
                    })}
                    <button
                        type="button"
                        className="add-media"
                        onClick={() => {
                            const count = mediaLinks.length;
                            if (count >= 10) {
                                return alert("You can only add up to 10 media links.");
                            }
                            const previousPath = mediaLinks[count - 1].path;
                            if (previousPath === "") {
                                return alert("Please fill the previous media link before adding a new one.");
                            }
                            setMediaLinks([...mediaLinks, { path: "" }]);
                        }}
                    >
                        Add More Media Links
                    </button>

                    <label>Unlock Date (At least one hour from now):</label>
                    <input
                        type="datetime-local"
                        name="unlockDate"
                        min={min.toISOString().slice(0, 16)}
                        value={date.toISOString().slice(0, 16)}
                        onChange={handleDateChange}
                        required
                        aria-required="true"
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
                                className={`suggest-date reset-chip${fadeReset ? " fade-out" : ""}`}
                                title="Reset selected suggestion to a year from now"
                                onClick={handleReset}
                            >
                                Reset
                            </span>
                        )}
                    </div>

                    <label className="checkbox-wrap">
                        Would you like the contents to be encrypted?
                        <input type="checkbox" name="isEncrypted" />
                    </label>

                    <input type="hidden" name="timezoneOffset" value={now.getTimezoneOffset()} />

                    <button type="submit">Lock It In A Capsule</button>
                </form>
            </div>
        </main>
    );
};