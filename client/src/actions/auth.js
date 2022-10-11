import axios from 'axios'

const register = async (user) =>
    await axios.post(`${process.env.REACT_APP_API}/register`, user)

const login = async (user) =>
    await axios.post(`${process.env.REACT_APP_API}/login`, user)

// update user in local storage
const updateUserInLocalStorage = (user, next) => {
    if (window.localStorage.getItem("auth")) {
        let auth = JSON.parse(localStorage.getItem("auth"))
        auth.user = user
        localStorage.setItem("auth", JSON.stringify(auth))
        next()
    }
}

export { register, login, updateUserInLocalStorage }