export default function sanitize(input, type) {
    switch (type) {
        case "username":
            return input.replaceAll(/[^A-Za-z0-9\._\-@]/, "").trim();
        
        case "email":
            return input.trim().toLowerCase(); // Many email providers are case-insensitive
        
        case "password":
            return input;
        default:
            console.log(`Unknown sanitize type: ${type}`);
            return input;
    }
};