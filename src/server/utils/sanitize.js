const nameRegex = /[^\p{L}\p{N} .'-]/gu;
const usernameRegex = /[^A-Za-z0-9\._\-@]/g;

export default function sanitize(input, type) {
    switch (type) {
        case "name":
            return input.replaceAll(nameRegex, "").trim();

        case "username":
            return input.replaceAll(usernameRegex, "").trim();
        
        case "email":
            return input.trim().toLowerCase(); // Many email providers are case-insensitive
        
        case "password":
            return input;
        
        default:
            console.log(`Unknown sanitize type: ${type}`);
            return input;
    }
};