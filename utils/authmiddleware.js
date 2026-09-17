const jwt = require("jsonwebtoken");
/*
console.log("MIDDLEWARE SECRET LOADED:", !!process.env.JWT_SECRET);
console.log("MIDDLEWARE SECRET LENGTH:", process.env.JWT_SECRET?.length);
*/
function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:" , error.message);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;