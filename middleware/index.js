import { expressjwt } from 'express-jwt'
import Hotel from '../models/Hotel.js'

// Validate the JWT Token
/* Data that was used when generating the token (_id in this case) will now be extracted and added to req.auth as long as the token is valid */
const requireSignin = expressjwt({    
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})

// Check to ensure that the person who added the hotel is the only one who can amend it
const hotelOwner = async (req, res, next) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec()
    let owner = hotel.postedBy._id.toString() === req.auth._id.toString()
    if (!owner) {
        return res.status(403).send("Unauthorized")
    }
    next()
}

export { requireSignin, hotelOwner }