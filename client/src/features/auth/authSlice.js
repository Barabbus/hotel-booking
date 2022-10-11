import { createSlice } from '@reduxjs/toolkit'

let userState

if (window.localStorage.getItem("auth")) {
    // Get user details from local storage if they exist and set user state
    userState = JSON.parse(window.localStorage.getItem("auth"))
} else {
    userState = null
}

const initialState = userState

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loggedInUser: (state, action) => {
            return state, action.payload
        },
        logoutUser: (state, action) => {
            action.payload = null
            return action.payload
        }
    }
})

export const { loggedInUser, logoutUser } = authSlice.actions

export default authSlice.reducer