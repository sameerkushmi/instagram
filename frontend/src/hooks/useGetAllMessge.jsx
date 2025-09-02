import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '@/components/redux/chatSlice'

const useGetAllMessage = () => {
    const dispatch = useDispatch()
    const {selectedUser} = useSelector(store => store.auth)
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true })
                if (response.data.success) {
                    dispatch(setMessages(response.data.messages))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllMessage()
    }, [selectedUser])
}

export default useGetAllMessage