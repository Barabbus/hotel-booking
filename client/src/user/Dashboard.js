import DashboardNav from '../components/DashboardNav'
import StripeConnectNav from '../components/StripeConnectNav'
import { Link } from 'react-router-dom'
import { userHotelBookings } from '../actions/hotel'
import useAuth from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import BookingCard from '../components/cards/BookingCard'

const Dashboard = () => {
    const { auth } = useAuth()
    const { token } = auth

    const [booking, setBooking] = useState([])

    useEffect(() => {
        loadUserBookings()
    }, [])

    const loadUserBookings = async () => {
        const res = await userHotelBookings(token)        
        setBooking(res.data)
    }

    return (
      <>
        <div className="container-fluid bg-primary bg-gradient p-5">
            <StripeConnectNav />
        </div>
        
        <div className="container-fluid p-4">
            <DashboardNav />
        </div>
            
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-10">
                    <h2>Your Bookings</h2>
                </div>
                <div className="col-md-2">
                    <Link to="/" className="btn btn-primary">
                        Browse Hotels
                    </Link>
                </div>
            </div>
        </div>
        <div className="row">
            {booking.map((book) => (
                <BookingCard
                    key={book._id}
                    hotel={book.hotel}
                    session={book.session}
                    orderedBy={book.orderedBy}
                />
            ))}
        </div>
      </>      
  )
}

export default Dashboard