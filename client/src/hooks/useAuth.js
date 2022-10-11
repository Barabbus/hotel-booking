import { useSelector } from 'react-redux'

// Custom hook to get auth state from redux
const useAuth = () => {
    const auth = useSelector(state => state)
    return auth
}

export default useAuth