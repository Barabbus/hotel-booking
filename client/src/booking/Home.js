import { useState, useEffect } from 'react'
import { allHotels } from '../actions/hotel'
import SmallCard from '../components/cards/SmallCard'

const Home = () => {
  const [hotels, setHotels] = useState([])
  
  useEffect(() => {
    loadAllhotels()
  }, [])

  const loadAllhotels = async () => {
    let res = await allHotels()
    setHotels(res.data)    
  }
  
  return (
    <>
      <div className="container-fluid bg-primary bg-gradient p-5 text-center">
        <h1>All Hotels</h1>
      </div>
      <div className="container-fluid">        
        {hotels.map((hotel) => (
          <SmallCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </>   
  )
}

export default Home