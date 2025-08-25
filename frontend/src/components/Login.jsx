import { useState } from "react"
import axios from "axios"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { FaSpinner } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { setAuthUser } from "./redux/authSlice"


const Login = () => {
  const [input,setInput] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
      const response = await axios.post("http://localhost:8080/api/v1/user/login", input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }); 
      if(response.data.success) {
        dispatch(setAuthUser(response.data.users));
        navigate("/");
        toast.success(response.data.message);
        setInput({
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

  return (
    <div className="flex items-center justify-center h-screen ">
      <form onSubmit={singupHandler} className="shadow-lg bg-zinc-100 flex flex-col gap-5 p-8 rounded-md">
        <div>
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">Login to see photos & videos from your friends</p>
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
            <Button>Login</Button>
        }
            <span>Dose not have an account?  <Link to="/signup" className="text-blue-600">Signup</Link></span>
      </form>
    </div>
  )
}

export default Login