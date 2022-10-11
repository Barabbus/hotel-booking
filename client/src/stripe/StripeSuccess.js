import { useEffect } from 'react'
import { stripeSuccessRequest } from '../actions/stripe'
import useAuth from '../hooks/useAuth'
import { useParams, useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

const StripeSuccess = () => {
  const { auth: { token } } = useAuth() // Another example of deconstructing token from auth
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    stripeSuccessRequest(token, params.hotelId)
      .then(res => {
        if (res.data.success) {          
          navigate("/dashboard")
        } else {
          navigate("/stripe/cancel")
        }
      })
  }, [params.hotelId])    

  return (
    <div className="container">
      <div className="d-flex justify-content-center p-5">
        <LoadingOutlined className="display-1 text-danger p-5" />
      </div>
    </div>
  )
}

export default StripeSuccess