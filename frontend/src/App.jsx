import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from "socket.io-client"
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './components/redux/socketSlice'
import { setOnlineUsers } from './components/redux/chatSlice'
import { setLikeNotification } from './components/redux/rtnSlice'
import ProtectRoute from './components/ProtectRoute'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectRoute><MainLayout /></ProtectRoute> ,
    children: [
      {
        path: "/",
        element: <ProtectRoute><Home /></ProtectRoute>
      },
      {
        path: "/profile/:id",
        element:<ProtectRoute><Profile /></ProtectRoute>
      },
      {
        path: "/account/edit",
        element: <ProtectRoute><EditProfile /></ProtectRoute>
      },
      {
        path: "/chat",
        element: <ProtectRoute><ChatPage /></ProtectRoute>
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  }
])

function App() {
  const { user } = useSelector(store => store.auth)
  const {socket} = useSelector(store=> store.socketio)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8080', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      })
      dispatch(setSocket(socketio))

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification))
      })

      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    } else if(socket){
      socket?.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
