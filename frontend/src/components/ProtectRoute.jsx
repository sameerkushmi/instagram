import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectRoute = ({children}) => {
    const {user} = useSelector(store => store.auth)
    const navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            navigate('/login')
        }
    },[])
  return (
    <>{children}</>
  )
}

export default ProtectRoute