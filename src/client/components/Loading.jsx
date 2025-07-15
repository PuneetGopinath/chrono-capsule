/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/client/components/Loading.jsx
 * License: MIT (see LICENSE)
*/

import { IconContext } from "react-icons";
import { FaHourglassHalf } from "react-icons/fa6";

export default function Loading({ text }) {
    return (
        <div className="loading-container" role="status" aria-live="polite">
            <h1 className="loading-text">{text || "Loading..."}</h1>
            <IconContext.Provider value={{ className: "loading-icon" }}>
                <FaHourglassHalf />
            </IconContext.Provider>
        </div>
    );
};