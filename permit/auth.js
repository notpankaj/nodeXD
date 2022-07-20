
const jwt = require("jsonwebtoken");
const authConfig = require("config").get("auth");
const response = require("../exchange/response");
const User = require("../models/user");

const getToken = (id, isExpired) => {

    const extractFrom = { _id: id }
    const options = {}

    if (isExpired) {
        options.expiresIn = "11h";
    }

    const token = jwt.sign(extractFrom, authConfig.jwtKey, options)
    return token
}

// const validateToken = async (req, res, next) => {

//     builder(req, res);

//     const log = req.context.logger.start(`permit:auth:validateToken`);

//     const token = req.headers["x-access-token"];

//     if (!token) {
//         return response.failure(res, "token is required");
//     }
//     const details = auth.extractToken(token, req.context);

//     if (details.name === "TokenExpiredError") {
//         return response.unAuthorized(res, "token expired");
//     }

//     if (details.name === "JsonWebTokenError") {
//         return response.failure(res, "token is invalid");
//     }

//     const user = await db.user.findById(details._id)

//     if (!user) {
//         return response.failure(res, "invalid user");
//     }

//     req.context.user = user

//     log.end();
//     return next();

// };

// const extractToken = (token, context) => {
//     const log = context.logger.start(`permit:auth:requiresToken:${token}`);
//     try {
//         const decoded = jwt.verify(token, authConfig.jwtKey);
//         log.end();
//         return decoded;
//     } catch (err) {
//         log.end();
//         return err;
//     }
// };


const extractToken = (token) => {
    try {
        const decoded = jwt.verify(token, authConfig.jwtKey)
        return decoded
    } catch (err) {
        return err
    }
}

const validateToken = async (req, res, next) => {

    const token = req.headers['x-access-token']

    if (!token) {
        return response.failure(res, "token is required")
    }

    const details = extractToken(token)
    if (details.name === "JsonWebTokenError") {
        return response.failure(res, "token is invalid")
    }
    // not tested
    if (details.name === "TokenExpiredError") {
        return response.failure(res, "token is expired")
    }


    const user = await User.findById(details._id)
    if (!user) {
        return response.failure(res, "invalid user")
    }

    // check if token is our
    // if(user.id ===  details._id){
    //     return response.failure(res, "this is not belongs to you token!")
    // }
    next()

}




exports.getToken = getToken;
exports.validateToken = validateToken;