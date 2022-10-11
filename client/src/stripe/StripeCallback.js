import { useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { getAccountStatus } from '../actions/stripe'
import { updateUserInLocalStorage } from '../actions/auth'
import { loggedInUser } from '../features/auth/authSlice'
import useAuth from '../hooks/useAuth'
import { useDispatch } from 'react-redux'

const StripeCallback = () => {

    const dispatch = useDispatch()    
    const { auth } = useAuth()

    useEffect(() => {
        if (auth && auth.token) accountStatus()
    }, [auth])

    const accountStatus = async () => {
        try {
            const res = await getAccountStatus(auth.token)            
            // Update user in local storage
            updateUserInLocalStorage(res.data, () => {
                // Update user in redux
                dispatch(loggedInUser(res.data))                
                // Redirect user to dashboard                
                window.location.href = "/dashboard/seller"                
            })
        } catch (err) {
            console.log(err)
        }        
    }
  return (
    <div className="d-flex justify-content-center p-5">
        <LoadingOutlined className="display-1 p-5 text-danger" />
    </div>
  )
}

export default StripeCallback