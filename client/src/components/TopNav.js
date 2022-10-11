import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { logoutUser } from '../features/auth/authSlice'

const TopNav = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { auth } = useAuth()

  const logout = () => {
    dispatch(logoutUser())
    // Delete user details from local storage
    window.localStorage.removeItem("auth")
    navigate("/login")
  }

  return (
    <div className="nav h5 bg-light d-flex justify-content-between">
      <Link className="nav-link" to="/">
        Home
      </Link>

      {auth !== null && (
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
      )}

      {auth !== null && (        
        <a className="nav-link pointer" onClick={logout}>
          Logout
        </a>
      )}

      {auth === null && (
        <>
          <Link className="nav-link" to="/login">
            Login
          </Link>
          <Link className="nav-link" to="/register">
            Register
          </Link>
        </>
      )}
    </div>
  )
}

export default TopNav