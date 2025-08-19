import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import axios from "axios"
import { toast } from "sonner"


const SignUp = () => {
  const [input,setInput] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)

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
      const response = await axios.post("http://localhost:8080/api/v1/user/register", input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }); 
      if(response.data.success) {
        toast.success(response.data.message);
        console.log(response)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("Network error or server is down");
      }
    } finally {
      setInput({
        username: "",
        email: "",
        password: ""
      })
    }
    
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <form onSubmit={singupHandler} className="shadow-lg flex flex-col gap-5 p-8">
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
            className="w-full focus:ring-transparent my-2"
          />
        </div>
        <div> 
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="w-full focus:ring-transparent my-2"
          />
        </div>
        <div> 
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="w-full focus:ring-transparent my-2"
          />
        </div>
        <Button>Signup</Button>
      </form>
    </div>
  )
}

export default SignUp