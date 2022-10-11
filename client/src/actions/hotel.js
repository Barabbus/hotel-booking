import axios from 'axios'

const createHotel = async (token, data) =>
    await axios.post(
        `${process.env.REACT_APP_API}/create-hotel`, data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

const allHotels = async () =>
    await axios.get(`${process.env.REACT_APP_API}/hotels`)

// Calculate difference between from and to hotel dates
const diffDays = (from, to) => {
    const day = 24 * 60 * 60 * 1000    
    const start = new Date(from)    
    const end = new Date(to)    
    const difference = Math.round(Math.abs((start - end) / day))
    return difference
}

const sellerHotels = async (token) =>
    await axios.get(`${process.env.REACT_APP_API}/seller-hotels`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

const deleteHotel = async (token, hotelId) =>
    await axios.delete(`${process.env.REACT_APP_API}/delete-hotel/${hotelId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

const getHotel = async (hotelId) =>
    await axios.get(`${process.env.REACT_APP_API}/hotel/${hotelId}`)

const updateHotel = async (token, data, hotelId) =>
    await axios.put(
        `${process.env.REACT_APP_API}/update-hotel/${hotelId}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

const userHotelBookings = async (token) =>
    await axios.get(`${process.env.REACT_APP_API}/user-hotel-bookings`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

const isAlreadyBooked = async (token, hotelId) =>
    await axios.get(`${process.env.REACT_APP_API}/is-booked/${hotelId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

export { createHotel, allHotels, diffDays, sellerHotels, deleteHotel, getHotel, updateHotel, userHotelBookings, isAlreadyBooked }  