/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/dashboard/CapsuleForm.jsx
 * License: MIT (see LICENSE)
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NotLoggedIn from "../NotLoggedIn";

const suggestions = [
    { text: "1 Hour", days: 0, hours: 1 },
    { text: "1 Week", days: 7 },
    { text: "1 Month", days: 30 },
    { text: "6 Months", days: 182 },
    { text: "1 Year", days: 365 }
];

function SuggestDate({ text, days, hours, setDate, isActive, setSelectedLabel }) {
    return <span className={`suggest-date${ isActive ? " active" : ""}`} title={`Unlocks in ${text.toLowerCase()} from today`} onClick={() => {
                const d = new Date(); // Already in local time
                d.setDate(d.getDate() + days);
                d.setHours(d.getHours() + hours);
                setDate(d);
                console.log(d);
                setSelectedLabel(text);
            }}>
                {text}
            </span>
}

export default function CapsuleForm() {
    if (!localStorage.getItem("token")) {
        return <NotLoggedIn text="To access this page, you need to be logged in." />;
    }

    const navigate = useNavigate();

    const [ submitting, setSubmitting ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ mediaError, setMediaError ] = useState(null);

    const [message, setMessage] = useState("");
    const maxChars = 5000;

    // Since this will run on client side, we automatically receive the local time.
    const min = new Date();
    //min.setHours(min.getHours() + 1); // Minimum unlock date is 1 hour from now
    min.setMinutes(min.getMinutes() + 5);
    min.setSeconds(0);
    min.setMilliseconds(0); // When we set the min value in the form, it auto truncates seconds and milliseconds, to make date validation work properly, we set them to 0
    //const valD = new Date();
    //valD.setFullYear(valD.getFullYear() + 1); // Default unlock date is 1 year from now

    const [date, setDate] = useState(min); //useState(valD);

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
            //setDate(valD);
            setDate(min);
            setFadeReset(false);
        }, 200);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent refreshing the page
        setSubmitting(true);
        setError(null);
        setMediaError(null);

        const form = event.target;
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData.entries());
        console.log("Minimum:", min, "\nUnlock Date Submitted:", new Date(formData.get("unlockDate")));
        //if (new Date(formData.get("unlockDate")) < min) {
        //    window.scrollTo(0, 0); // Scroll to top if error
        //    return setError("Unlock Date must be at least 1 hour from now.");
        //}

        try {
            const res = await fetch("/api/capsules/create", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            });
            const data = await res.json();

            setSubmitting(false);
            if (res.ok) {
                alert("Capsule created successfully!");
                form.reset(); // Reset the form
                setMessage("");
                //setDate(valD);
                setDate(min);
                setSelectedLabel(null);
                navigate("/dashboard/view");
            } else {
                setError("Unable to create capsule: " + data.message || "An unknown error occurred.");
                window.scrollTo(0, 0);
                console.log("[❌ Error] details:", data);
            }
        } catch (err) {
            setSubmitting(false);
            console.log("[❌ Error] Failed to create capsule:", err);
            setError("An error occurred while trying to create the capsule. Please try again later.");
            window.scrollTo(0, 0);
        }
    }

    const handleDateChange = (e) => {
        const d = new Date(e.target.value);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setDate(d);
        setSelectedLabel(null);
    };

    const toLocalISOString = (date) => {
        const pad = (num) => num.toString().padStart(2, "0");

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Since months are 0 indexed
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return (
        <main>
            <div className="form-container capsule">
                <h2>Create a capsule</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                    {mediaError && <div className="error-msg">{mediaError}</div>}
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
                                return setMediaError("You can only add up to 10 media links.");
                            }
                            const previousPath = mediaLinks[count - 1].path;
                            if (previousPath === "") {
                                return setMediaError("Please fill the previous media link before adding a new one.");
                            }
                            setMediaLinks([...mediaLinks, { path: "" }]);
                        }}
                    >
                        Add More Media Links
                    </button>

                    <label>Unlock Date:</label><small>Must be at least 5 minutes later - temporarily allowed</small>{/*<small>At least an hour from now - by default, a year later</small>*/}
                    <input
                        type="datetime-local"
                        name="unlockDate"
                        min={toLocalISOString(min).slice(0, 16)}
                        value={toLocalISOString(date).slice(0, 16)}
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
                                hours={s.hours ?? 0}
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
                        <input type="checkbox" name="isEnc" />
                    </label>

                    <input type="hidden" name="timezoneOffset" value={new Date().getTimezoneOffset()} />

                    <button type="submit" disabled={submitting}>Lock It In A Capsule</button>
                </form>
            </div>
        </main>
    );
};