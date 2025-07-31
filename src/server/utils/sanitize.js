const nameRegex = /[^\p{L}\p{N} .'-]/gu;
const usernameRegex = /[^A-Za-z0-9\._\-@]/g;
const msgRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g; // Remove non printable characters except newline, tab and carriage return

export default function sanitize(input, type) {
    if (type !== "email" && type !== "password")
        input = input.normalize("NFKC");
    switch (type) {
        case "name":
            return input.replace(nameRegex, "").trim();

        case "username":
            return input.replace(usernameRegex, "").trim();
        
        case "email":
            return input.trim().toLowerCase(); // Many email providers are case-insensitive
        
        case "password":
            return input;
        
        case "message":
            return input.replace(msgRegex, "");
        
        default:
            throw new Error(`sanitize: unknown type "${type}"`);
    }
};