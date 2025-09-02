import { useState,useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { toast } from "sonner"
import { FaSpinner } from "react-icons/fa"
import { useSelector } from "react-redux"


const SignUp = () => {
  const [input,setInput] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const {user} = useSelector(store => store.auth)
  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const singupHandler = async(e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/api/v1/user/register", input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }); 
      if(response.data.success) {
        navigate("/login");
        toast.success(response.data.message);
        setInput({
          username: "",
          email: "",
          password: ""
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("Network error or server is down");
      }
    } finally {
      setLoading(false);
    }
    
  }

    useEffect(()=>{
      if(user){
        navigate('/')
      }
    },[])

  return (
    <div className="flex items-center justify-center h-screen ">
      <form onSubmit={singupHandler} className="shadow-lg bg-zinc-100 flex flex-col gap-5 p-8 rounded-md">
        <div>
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">Singup to see photos & videos from your friends</p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="w-full focus:ring-transparent bg-white my-2"
          />
        </div>
        <div> 
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="w-full focus:ring-transparent bg-white my-2"
          />
        </div>
        <div> 
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="w-full focus:ring-transparent bg-white my-2"
          />
        </div>
        {
            loading ?
            <Button><FaSpinner className="animate-spin" />Please wait</Button>
            :
            <Button> Signup</Button>
        }
        <span>Already have an account?  <Link to="/login" className="text-blue-600">Login</Link></span>
      </form>
    </div>
  )
}

export default SignUp