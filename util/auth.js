import jwt from 'jsonwebtoken'

const createJWTToken = ( user ) => {
    return jwt.sign({ user } , 'secret123', {
        expiresIn: '1h'
    } )
}

module.exports = {
    createJWTToken
}