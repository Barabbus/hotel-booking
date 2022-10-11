import { useState } from 'react'
import { toast } from 'react-toastify'
import { createHotel } from '../actions/hotel'
import useAuth from '../hooks/useAuth'
import HotelCreateForm from '../components/forms/HotelCreateForm'

const NewHotel = () => {
  const { auth } = useAuth()
  const { token } = auth

  const [values, setValues] = useState({
    title: "",
    content: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
    location: ""
  })

  const [preview, setPreview] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  )
  
  // destructuring variables from state
  const { title, content, image, price, from, to, bed, location } = values

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Need to use FormData object to send an image
    let hotelData = new FormData()
    hotelData.append("title", title)
    hotelData.append("content", content)
    hotelData.append("location", location)
    hotelData.append("price", price)
    // Check to ensure we have an image to append to the FormData object
    image && hotelData.append("image", image)
    hotelData.append("from", from)
    hotelData.append("to", to)
    hotelData.append("bed", bed)    

    try {
      let res = await createHotel(token, hotelData)      
      toast.success("New hotel has been posted")
      // Reload the page after two seconds which will clear all the fields of data
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      console.log(err)
      toast.error(err.response.data)
    }    
  }

  const handleImageChange = (e) => {    
    // Get the image that was selected and display in the preview pane
    setPreview(URL.createObjectURL(e.target.files[0]))    
    setValues({ ...values, image: e.target.files[0] })
  }

  // Update values in state from form
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }    

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient p-5 text-center">
        <h2>Add Hotel</h2>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <br />
            <HotelCreateForm
              values={values}
              setValues={setValues}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              handleSubmit={handleSubmit}            
            />
          </div>
          <div className="col-md-2">
            <img
              src={preview}
              alt="preview_image"
              className="img img-fluid m-2"
            />
            {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default NewHotel