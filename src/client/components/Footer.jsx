export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <p>&copy; {new Date().getFullYear()} Chrono Capsule</p>
                <p>Time-locked thoughts from your present self</p>
            </div>

            <div className="footer-right">
                <a href="/">About</a>
                <a href="/">Terms</a>
                <a href="/">Privacy</a>
                <a href="mailto:support@xxx.com">Contact</a>
            </div>
        </footer>
    );
};