"use client";

import { useState , useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation";
import axios from "axios";
import { setCookie } from 'nookies';

const backendurl = "https://chat-backend-rx0j.onrender.com";

const registerUserUrl =`${backendurl}/api/user/register`

export default function SignupPage() {

    const router  = useRouter();
  const [loading ,setLoding] =useState(false);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e ) => {
    setLoding(true);
    e.preventDefault()
    setError("");
    if (!name || !email || !password ) {
      setError("All filds are required!");
      return; 
    }

    try {
      await axios.post(registerUserUrl , {
        username: name,
        email: email,
        password: password,       
      })
      .then((res) => {
        console.log(res.data.username);
        if(typeof window !== undefined){
          localStorage.setItem("username" , res.data.username)
          localStorage.setItem("userId" , res.data.userId)
        }
        setCookie(null, 'username', res.data.username, {
          maxAge: 30 * 24 * 60 * 60, // Cookie expiration time
          path: '/', // Accessible across all routes
        });
        router.push('/connect')
      })
      .catch((err) => {
        console.log(err);
      //   setError(err.response.data.msg);
      })

    } catch (error) {
      console.error(error);
      
      // setError(error.message);
    }
    setLoding(false);
    // console.log("Signup attempt with:", { name, email, password })
  }

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              { (loading === true) ? (
                <Button  disabled={true} className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-8 8 8 0 01-8-8z"></path>
                    </svg>
                    Signing in...
              </Button>
              ):(
                <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700" type="submit">
                Create Account
              </Button>
              ) 
              }
              
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}