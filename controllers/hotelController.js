import Hotel from '../models/Hotel.js'
import Order from '../models/Order.js'
import fs from 'fs'

const createHotel = async (req, res) => {
    // Note: fields and files are added to the request object by formidable    
    try {
        let fields = req.fields
        let files = req.files

        let hotel = new Hotel(fields)
        hotel.postedBy = req.auth._id
        // handle image
        if (files.image) {
            // Get all the data for the image
            hotel.image.data = fs.readFileSync(files.image.path)
            hotel.image.contentType = files.image.type
        }

        hotel.save((err, result) => {
            if (err) {
                console.log("saving hotel err => ", err)
                res.status(400).send("Error saving")
            }
            res.json(result)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            err: err.message
        })
    }
}

const getHotels = async (req, res) => {
    // Only get and display hotels later than the current date 
    let all = await Hotel.find({ from: { $gte: new Date()}})
        .limit(24)
        .select("-image.data")
        // Hotel model has a postedBy field so can access User info such as Id and name as long as we use populate 
        .populate("postedBy", "_id name")
        .exec()    
    res.json(all)
}

// Get hotel image from database
const getImage = async (req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec()
    if (hotel && hotel.image && hotel.image.data !== null) {
        // set Content-Type header in the response object
        res.set("Content-Type", hotel.image.contentType)
        return res.send(hotel.image.data)
    }
}

// Get all hotels for a particular seller
const getSellerHotels = async (req, res) => {
    let all = await Hotel.find({ postedBy: req.auth._id })
        .select("-image.data")
        .populate("postedBy", "_id name")
        .exec()    
    res.send(all)
}

const removeHotel = async (req, res) => {
    let removed = await Hotel.findByIdAndDelete(req.params.hotelId)
        .select("-image.data")
        .exec()
    res.json(removed)
}

const getHotel = async (req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId)
        .populate("postedBy", "_id name")
        .select("-image.data")
        .exec()    
    res.json(hotel)
}

const updateHotel = async (req, res) => {
    try {
        let fields = req.fields
        let files = req.files

        let data = { ...fields }

        if (files.image) {
            let image = {}
            image.data = fs.readFileSync(files.image.path)
            image.contentType = files.image.type
            data.image = image
        }

        let updated = await Hotel.findByIdAndUpdate(req.params.hotelId, data, {
            new: true,
        }).select("-image.data")
        res.json(updated)
    } catch (err) {
        console.log(err)
        res.status(400).send("Hotel update failed. Try again.")
    }
}

const userHotelBookings = async (req, res) => {
    const all = await Order.find({ orderedBy: req.auth._id })
        // Get the session details for that order
        .select("session")
        // Get all hotel fields data except image
        .populate("hotel", "-image.data")
        // Get users Id and name
        .populate("orderedBy", "_id name")
        .exec()
    res.json(all)
}

const userAlreadyBooked = async (req, res) => {
    const { hotelId } = req.params
    // Find orders of the currently logged in user
    const userOrders = await Order.find({ orderedBy: req.auth._id })
        .select("hotel")        
        .exec()    
    // Check if hotel id is found in userOrders array
    let ids = []    
    for (let i = 0; i < userOrders.length; i++) {
        ids.push(userOrders[i].hotel.toString())        
    }
    res.json({
        ok: ids.includes(hotelId)        
    })
}

export { createHotel, getHotels, getImage, getSellerHotels, removeHotel, getHotel, updateHotel, userHotelBookings, userAlreadyBooked } 