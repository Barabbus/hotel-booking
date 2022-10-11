import axios from 'axios'

const createConnectAccount = async (token) =>
    await axios.post(
        `${process.env.REACT_APP_API}/create-connect-account`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

const getAccountStatus = async (token) =>
    await axios.post(
        `${process.env.REACT_APP_API}/get-account-status`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

const getAccountBalance = async (token) =>
    axios.post(
        `${process.env.REACT_APP_API}/get-account-balance`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

const currencyFormatter = (data) => {
    return (data.amount / 100).toLocaleString(data.currency, {
        style: "currency",
        currency: data.currency
    })
}

const payoutSetting = async (token) =>
    await axios.post(
        `${process.env.REACT_APP_API}/payout-setting`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

const getSessionId = async (token, hotelId) =>
    await axios.post(
        `${process.env.REACT_APP_API}/stripe-session-id`,
        {
            hotelId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

const stripeSuccessRequest = async (token, hotelId) =>
    await axios.post(
        `${process.env.REACT_APP_API}/stripe-success`,
        {
            hotelId
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )


export { createConnectAccount, getAccountStatus, getAccountBalance, currencyFormatter, payoutSetting, getSessionId, stripeSuccessRequest } 