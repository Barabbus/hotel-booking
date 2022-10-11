import express from 'express'
// Below import required to handle form data
import formidable from 'express-formidable'

const router = express.Router()

import { requireSignin, hotelOwner } from '../middleware/index.js'

// controllers
import {
    createHotel,
    getHotels,
    getImage,
    getSellerHotels,
    removeHotel,
    getHotel,
    updateHotel,
    userHotelBookings,
    userAlreadyBooked
} from '../controllers/hotelController.js'

router.post("/create-hotel", requireSignin, formidable(), createHotel)
router.get("/hotels", getHotels)
router.get("/hotel/image/:hotelId", getImage)
router.get("/seller-hotels", requireSignin, getSellerHotels)
router.delete("/delete-hotel/:hotelId", requireSignin, hotelOwner, removeHotel)
router.get("/hotel/:hotelId", getHotel)
router.put(
    "/update-hotel/:hotelId",
    requireSignin,
    hotelOwner,
    formidable(),
    updateHotel,
    userHotelBookings
)

// Orders
router.get("/user-hotel-bookings", requireSignin, userHotelBookings)
router.get("/is-booked/:hotelId", requireSignin, userAlreadyBooked)

// V.Imp - Need this old ES5 line to require route in server.js else it will throw an error
export default router