import { useState } from 'react'
import { toast } from 'react-toastify'
import { login } from '../actions/auth'
import LoginForm from '../components/LoginForm'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loggedInUser } from '../features/auth/authSlice'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let res = await login({ email, password })
      if (res.data) {        
        // save user and token to local storage
        window.localStorage.setItem("auth", JSON.stringify(res.data))
        dispatch(loggedInUser(res.data))
        navigate("/dashboard")
      }      
    } catch (err) {
      console.log(err)
      if (err.response.status === 400) toast.error(err.response.data)    
    }
  }

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient p-5 text-center">
        <h1>Login</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <LoginForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Login