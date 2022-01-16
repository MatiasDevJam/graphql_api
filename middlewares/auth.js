import jwt from 'jsonwebtoken'
const authenticate = ( req, res, next ) => {

    const token = req.headers.Authorization?.split("")[1];

    try {
        const verified = jwt.verify({ token }, "secret123" )
        req.verifiedUser = verified.user
        next();
    } catch (error) {
        // console.log( error )
        next()
    }
}

export default authenticate