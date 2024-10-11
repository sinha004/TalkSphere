




'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, UserCheck } from 'lucide-react'
import axios from "axios"

const backendurl = "https://chat-backend-rx0j.onrender.com";
const getAllUserUrl = `${backendurl}/api/user/getallusers`
const getUserChatsUrl = `${backendurl}/api/chat/getuserchats`;
const connectUsers = `${backendurl}/api/chat/createchat`;

export default function UserConnectionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState([])
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  async function getAllUsers(){
    try {
      const res = await axios.get(getAllUserUrl)
      const allUsers = res.data.allUsers;
      const formattedUsers = allUsers.map((user) => ({
        ...user,
        isConnected: user.connectedUsers.includes(currentUserId)
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error(error)
    }
  }

  const handleConnect = async (username) => {
    setUsers(users.map(user => 
      user.username === username ? { ...user, isConnected: !user.isConnected } : user
    ))
    try {
      await axios.post(connectUsers, { username1: currentUsername, username2: username })
    } catch (error) {
      console.log(error)
    }
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if(typeof window !== "undefined"){
      setCurrentUsername(localStorage.getItem("username"));
      setCurrentUserId(localStorage.getItem("userId"));
    }
    getAllUsers();
  }, [currentUsername])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-8">
      <main className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-8 text-center"
        >
          Connect with Users
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8 max-w-md mx-auto"
        >
          <Input
            type="search"
            placeholder="Search users"
            className="w-full pl-12 pr-4 py-3 bg-purple-700 bg-opacity-50 text-white placeholder-purple-300 border-purple-500 rounded-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-100 h-5 w-5" />
        </motion.div>

        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between bg-purple-700 bg-opacity-30 backdrop-blur-md rounded-xl p-4 transition-all duration-300 hover:bg-opacity-50 hover:shadow-xl">
                  <div className="flex items-center flex-1 min-w-0">
                    <Avatar className="w-12 h-12 border-2 border-purple-500 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback className="text-lg font-bold bg-purple-600 text-white">
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {user.username}
                      </h3>
                      <p className="text-xs text-purple-300 truncate">
                        {user.username}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={user.isConnected ? "secondary" : "default"}
                    disabled={user?.isConnected ? true : false}
                    size="sm"
                    onClick={() => handleConnect(user.username)}
                    className={`ml-2 flex-shrink-0 text-xs px-3 py-1 transition-all duration-300 ${
                      user.isConnected 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {user.isConnected ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}




// "use client";

// import { useEffect, useState } from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { ArrowLeft, Search, UserPlus, UserCheck } from "lucide-react"
// import Link from "next/link"
// import axios from "axios"
// const backendurl = "https://chat-backend-rx0j.onrender.com";
// const getAllUserUrl = `${backendurl}/api/user/getallusers`
// const getUserChatsUrl = `${backendurl}/api/chat/getuserchats`;
// const connectUsers = `${backendurl}/api/chat/createchat`;


// export default function UserConnectionPage() {

// //   const [connectedUsers, setConnectedUsers] = useState([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [users, setUsers] = useState([])
//   const [currentUsername, setCurrentUsername] = useState("");
//   const [currentUserId, setCurrentUserId] = useState("");

//   async function getAllUsers(){
//     try {
//         await axios.get(getAllUserUrl)
//         .then((res) => {
//             // console.log(res.data);
//             const allUsers = res.data.allUsers;
//             // let formatedUsers = {};
//             // console.log(allUsers)
//             const x = allUsers.map((user) => {
//               let isConnected;
//               if(user.connectedUsers.includes(currentUserId)){
//                 isConnected = true;
//               }else{
//                 isConnected = false;
//               }
//               const newUserObj = {...user, isConnected:isConnected}
//               // formatedUsers = [...formatedUsers, newUserObj];
//               // setUsers(formatedUsers);
//               // console.log(users)
//               // console.log(formatedUsers)
//               return newUserObj;
//             })
//             console.log(x);
//             setUsers(x);
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     } catch (error) {
//         console.error(error)
//     }
//   }

//   const handleConnect = async (username) => {
//     setUsers(users.map(user => 
//       user.username === username ? ({ ...user, isConnected: !user.isConnected }) : (user)
//     ))
//     try {
//         await axios.post(connectUsers , {username1:currentUsername, username2:username})
//         .then((res) => {
//             console.log(res.data)
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     } catch (error) {
//         console.log(error)
//     }
//   }

//   const filteredUsers = users?.filter(user => 
//     user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.username.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   useEffect(() => {
//     if(typeof window !== "undefined"){
//         setCurrentUsername(localStorage.getItem("username"));
//         setCurrentUserId(localStorage.getItem("userId"));
//     }
//     // console.log()
//     // const username = "one";
//     console.log(currentUsername, currentUserId)
//     // console.log()
//     getAllUsers();
//     // console.log(users)
//   },[currentUsername])

//   if(!users){
//     return (
//         <></>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-indigo-900 text-white">
//       <header className="bg-indigo-800 p-4 flex items-center">
//         {/* <Link href="/home" className="mr-4">
//           <Button variant="ghost" size="icon">
//             <ArrowLeft className="h-6 w-6" />
//           </Button>
//         </Link> */}
//         <h1 className="text-xl font-bold">Connect with Users</h1>
//       </header>

//       <main className="container mx-auto px-4 py-6">
//         <div className="mb-6 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <Input
//             className="pl-10 bg-indigo-800 text-white placeholder-indigo-300 border-indigo-700"
//             placeholder="Search users"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <ScrollArea className="h-[calc(100vh-200px)]">
//           <div className="space-y-4">
//             {filteredUsers?.map((user) => (
//               <Card key={user._id} className="bg-indigo-800">
//                 <CardContent className="p-4 flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <Avatar>
//                       <AvatarImage src={user?.avatar} alt={user?.username} />
//                       <AvatarFallback>{user?.username[0]?.toUpperCase()}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h2 className="font-semibold">{user?.username}</h2>
//                       <p className="text-sm text-indigo-300">{user?.username}</p>
//                     </div>
//                   </div>
//                   <Button
//                     variant={user?.isConnected ? "secondary" : "default"}
//                     disabled={user?.isConnected ? true : false}
//                     size="sm"
//                     onClick={() => handleConnect(user?.username)}
//                     className={user?.isConnected ? "bg-green-500 hover:bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"}
//                   >
//                     {user?.isConnected ? (
//                       <>
//                         <UserCheck className="mr-2 h-4 w-4" />
//                         Connected
//                       </>
//                     ) : (
//                       <>
//                         <UserPlus className="mr-2 h-4 w-4" />
//                         Connect
//                       </>
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </ScrollArea>
//       </main>
//     </div>
//   )
// }