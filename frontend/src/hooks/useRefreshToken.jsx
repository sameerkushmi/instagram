import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const useRefreshToken = () => {
    const navigate = useNavigate()

  useEffect(()=>{
    const fetchUser = async() => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/user/refresh',{
                withCredentials: true
            })
            if(response.data.success){
                navigate('/')
            }
        } catch (error) {
            navigate('/login')
        }
    }
    fetchUser()
  },[])
}

export default useRefreshToken