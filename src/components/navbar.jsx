"use client";

import { useState, useEffect, useRef, useMemo } from 'react'
import {  Users, MessageCircle, MessageCircleMore, Video, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'
import {  useRouter,usePathname } from 'next/navigation';
import { destroyCookie } from 'nookies';
export default function Navbar() {

    const router = useRouter()
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false)
    // const [pathname , setPathname] = useState(location)
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");

    const handleLogout = () => {
        // Clear user data from localStorage or sessionStorage
        if(typeof window !== "undefined"){
        localStorage.clear();
          destroyCookie(null, 'username', { path: '/' });
        router.push("/login");
        }
      

    };

    // useEffect(() => {
    //     if(typeof window !== "undefined"){
    //         setCurrentUsername(localStorage.getItem("username"));
    //         setCurrentUserId(localStorage.getItem("userId"));
    //     }
    //     // console.log(currentUsername, currentUserId)
    // },[change])
    useEffect(() => {
        // console.log(pathname)
        if(typeof window !== "undefined"){
            setCurrentUsername(localStorage.getItem("username"));
            setCurrentUserId(localStorage.getItem("userId"));
        }

        return () => {
            // Cleanup code when the component unmounts or before the pathname changes

        };
    },[pathname])
  
    const navItems = [
      {name: "Message" , href:'/message' , icon: <MessageCircleMore  className="h-5 w-5" />},
      { name: 'Connect Users',href:"/connect" , icon: <Users className="h-5 w-5" /> },
      { name: 'TheraWin ChatBot', href:"/chatbot", icon: <MessageCircle className="h-5 w-5" /> },
      { name: 'Video Call', href:"https://nextjs-zegocloud-uikits-groul.vercel.app/" ,icon: <Video className="h-5 w-5" /> },
    ]

    if(!currentUsername && !currentUserId){
        return (
            <></>
        )
    }

  
    return (
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href='/' className="font-bold text-xl">TheraWin</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition duration-300"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
                <span>
                <LogOut onClick={handleLogout} /> 
                </span>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
  
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700 transition duration-300"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
                <div className='flex mt-2'>
                <button onClick={handleLogout} className='flex mt-2'>
                <LogOut className='mx-[10px]' /> 
                <p>Logout</p>
                </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    )
  }