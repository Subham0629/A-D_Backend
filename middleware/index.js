const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Response = require("../libs/response");
const { responseMessage } = require("../libs/responseMessages");

const middleware = {

    jwtVerify: async (req, res, next) => {
        try {


            if (!req.headers.authorization) {
                throw {
                    code: 403,
                    err: "Auhorization header is missing",
                    message: "Authorization header is missing while verifying token"
                };
            }

            let lang = 'en';

            /*STEP1- verifiation of token and decode after successful verification of token */
            let encryptedData = req.headers.authorization.replace("Bearer ", "");
            const token = encryptedData;
            const decodedToken = await jwt.verify(
                token,
                env.secret,
                (err, result) => {
                    if (err) {
                        throw {
                            code: 401,
                            message: responseMessage(lang,"TOKEN_VERIFICATON_FAILED"),
                            err: err
                        };
                    } else {
                        return result;
                    }
                }
            )

            // if (!(decodedToken && decodedToken.sub && decodedToken.exp)) {
            //     throw {
            //         code: 401,
            //         message: responseMessage(lang,"TOKEN_VERIFICATON_FAILED" ),
            //         err: responseMessage(lang,"INVALID_TOKEN")
            //     };

            // }


            // let tokenExpiry = decodedToken.exp * 1000;

            // let currentDate = new Date().getTime();
            // let tokenDate = new Date(tokenExpiry).getTime();

            // if (tokenDate < currentDate) {

            //     throw {
            //         code: 401,
            //         message: responseMessage(lang,"TOKEN_IS_EXPIRED"),
            //         err: responseMessage(lang,"INVALID_TOKEN")
            //     };
            // }


            // let getUserByToken = await getUserData(token, decodedToken.sub, req);

            // if (!(getUserByToken && getUserByToken.data && getUserByToken.data.company_id)) {
            //     throw {
            //         code: 401,
            //         message: responseMessage(lang,"TOKEN_VERIFICATON_FAILED"),
            //         err: responseMessage(lang,"INVALID_TOKEN" )
            //     };
            // }
            
             // Check if decodedToken is valid
            if (!decodedToken) {
             throw new Error("Invalid token");
            }

            // If decodedToken is valid, proceed to route handler
            next();

        } catch (error) {

            let statusCode = '';

            if (error && error.response && error.response.status) {
                statusCode = error.response.status;
            }
            if (error && error.code) {
                statusCode = error.code;
            }           

            if (error && error.response && error.response.data) {
    
                res.status(statusCode || 401).json(
                    await Response.errors({
                        err: error.response.data,
                        code: statusCode,
                        message: error.message
                    })
                );


            } else {
              
                res.status(statusCode || 401).json(
                    await Response.errors({
                        err: error.err || error,
                        code: statusCode,
                        message: error.message
                    })
                );
            }



        }
    }
};



module.exports = middleware;