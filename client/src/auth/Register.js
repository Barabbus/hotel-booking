import { useState } from 'react'
import RegisterForm from '../components/RegisterForm'
import { register } from '../actions/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await register({
        name,
        email,
        password
      })      
      toast.success("Registration successful.  Please login.")
      navigate("/login")
    } catch (err) {      
      if (err.response.status === 400) toast.error(err.response.data)
    }
  }  

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient p-5 text-center">
        <h1>Register</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <RegisterForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
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

export default Register