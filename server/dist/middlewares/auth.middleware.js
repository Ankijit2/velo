import { decode } from "next-auth/jwt";
import { ApiError } from "../utils/ApiError.js";
const authenticateJWT = async (req, res, next) => {
    try {
        const cokkie = await req.cookies;
        const sessionToken = await req.cookies["authjs.session-token"];
        if (!sessionToken) {
            throw new ApiError(403, "Unauthorized: No token found");
        }
        console.log(process.env.AUTH_SECRET);
        const decodedToken = await decode({
            token: sessionToken,
            secret: process.env.AUTH_SECRET,
            salt: "authjs.session-token"
        });
        if (!decodedToken) {
            throw new ApiError(403, "Unauthorized: Invalid token");
        }
        req.session = decodedToken; // Attach decoded session data to the request object
        next();
    }
    catch (error) {
        console.error("Failed to authenticate", error);
        res.status(403).json({ error: "Unauthorized" });
    }
};
export default authenticateJWT;
