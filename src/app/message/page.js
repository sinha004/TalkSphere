'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Users, Plus, ArrowLeft, Send, User } from 'lucide-react'
import axios from 'axios'
import { io } from 'socket.io-client'
import dayjs from 'dayjs'

// Socket io connection => 

const ENDPOINT = "http://localhost:4000"

let username;

// Check if window is defined (i.e., code is running in the browser)
if (typeof window !== "undefined") {
  // Check if localStorage is available
  username = (localStorage.getItem("username") ? (localStorage.getItem("username")) : (""));
}
const backendurl = "https://chat-backend-rx0j.onrender.com";
const getUserDataUrl = `${backendurl}/api/user/getuser`;
const createNewChatUrl = `${backendurl}/api/chat/createnewchat`;
const getUserChatsUrl = `${backendurl}/api/chat/getuserchats`;
const getUserGroupsUrl = `${backendurl}/api/groupchat/getusergroups`
const pushMessageInGroup = `${backendurl}/api/groupchat/pushmessageingroup`
const getChatByIdUrl = `${backendurl}/api/chat/getchatbyid`;
const getGroupChatByIdUrl = `${backendurl}/api/groupchat/getgroupchatbyid`;
const createGroupUrl = `${backendurl}/api/groupchat/creategroup`;



function ChatView({ chat, onBack }) {

  let user;
  if (typeof window !== "undefined") {
    // Check if localStorage is available
    user = JSON.parse(localStorage.getItem("user"));
    // setCurrentUser(user);
  }


  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const [currentUser , setCurrentUser] = useState(user);
  const [roomId , setRoomId] = useState(chat._id)
  const [change , setChange] = useState(1);
  const [Chat , setChat] = useState(chat);
  const [ typing ,setTyping] = useState(false);
  const [otherUserTyping , setOtherTypingUser] = useState(false);
  const [typingUser , setTypingUser] =useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const typingDelay = 2000; //
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
  }

  const socket = useMemo(() => {
    return (io(backendurl));
  },[roomId])

  const handletyping=(e)=>{
    const usernamme = currentUser.username;
    socket.emit("typing", {roomId ,fromUserName:username} )

    clearTimeout(typingTimer);
    // Set a new timer

    const newTimer = setTimeout(() => {
        setIsTyping(false);
        console.log("set timer")
        socket.emit("stop_typing" , {roomId , fromUserName:currentUser.username})
    }, typingDelay);

    setTypingTimer(newTimer);
  }
    
  useEffect(() => {
    // console.log(change)
    chat = Chat;
    // console.log(chat , Chat);
    scrollToBottom()
  }, [chat.messages,change,roomId])

  useEffect(() => {
    const userId = currentUser._id;
    const currentUsername = currentUser.username

    // console.log(userId, roomId);

    // join the room as soon as user open chat
    socket.emit("join_room" , {roomId:roomId , userId:userId})
    console.log("room joined")


    // listen for any recieving message on room
    socket.on('receive_message', ({ message, fromUserId, fromUserName, updatedChat, isGroupChat }) => {
      // console.log(updatedChat.chat);
      // const lastChatMessageIdx = updatedChat.chat.allMessages.length - 1
      // const lastChatMessage = updatedChat.chat.allMessages[lastChatMessageIdx];
      // const newMessageObj = {
      //   _id: lastChatMessage._id,
      //   message: message,
      //   sender: lastChatMessage.sender,
      //   time: lastChatMessage.time,
      //   timestamp: lastChatMessage.timestamp
      // }
      const newChat  = {
        _id: updatedChat.chat._id,
        avatar: "",
        isGroup:isGroupChat,
        messages: [...updatedChat.chat.allMessages],
        lastMessage: updatedChat.chat.lastMessage,
        name: chat.name,
      }
      setChat(newChat);
      setChange(Math.random()*10);
    });

    socket.on("typing", ({ fromUserName}) => {
      
      // setOtherTypingUser(true)
      console.log("typing.."  , fromUserName)
      if(fromUserName !== currentUsername){
        setOtherTypingUser(true)
        if(chat.isGroup===true){
          setTypingUser(fromUserName)
        }
      }
    })

    socket.on("stop_typing", ({roomId,fromUserName}) => {
      console.log("stop typing",roomId, fromUserName)
      setOtherTypingUser(false);
    })

    return () => {
      socket.disconnect('receive_message');
      socket.off('typing');
      socket.off('stop_typing');
      // socket.on("stop_typing" , {roomId})
      // socket.emit("stop_typing" , {roomId , fromUserName:currentUser.username})
      // socket.disconnect('typing');
      // socket.disconnect('stop_typing');
    };
  }, [roomId])


  const handleSendMessage = async (e) => {
    e.preventDefault();
    // handle new message for one to one chat
    if (newMessage.trim() !== "" && chat.isGroup === false) {
      // emit a message to the roomId from current user
      socket.emit('send_message', { message:newMessage, roomId:roomId, fromUserName:currentUser.username, fromUserId: currentUser._id, isGroupChat:false });
      setNewMessage("");
      // await axios.post(createNewChatUrl, {
      //   username1: username, username2: chat.name,
      //   sender: username, message: newMessage
      // })
      //   .then((res) => {
      //     // console.log(res.data)
      //     const lastChatMessageIdx = res.data.chat.allMessages.length - 1
      //     const lastChatMessage = res.data.chat.allMessages[lastChatMessageIdx];
      //     const newMessageObj = {
      //       _id: lastChatMessage._id,
      //       message: newMessage,
      //       sender: lastChatMessage.sender,
      //       time: lastChatMessage.time,
      //       timestamp: lastChatMessage.timestamp
      //     }
      //     // updation in chat messages and last message
      //     chat.messages = [...chat.messages, newMessageObj]
      //     chat.lastMessage = newMessage,

      //       setNewMessage("");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     return;
      //   })
    }
    // handle new message for group chat
    else if (newMessage.trim() !== "" && chat.isGroup === true) {
      socket.emit('send_message', { message:newMessage, roomId:roomId, fromUserName:currentUser.username, fromUserId: currentUser._id, isGroupChat:true });
      setNewMessage("");
      // console.log("new group message!")
      // await axios.post(pushMessageInGroup, {
      //   groupId: chat._id,
      //   sender: username, message: newMessage
      // })
      //   .then((res) => {
      //     console.log(res.data)
      //     const lastChatMessageIdx = res.data.groupchat.allMessages.length - 1
      //     const lastChatMessage = res.data.groupchat.allMessages[lastChatMessageIdx];
      //     const newMessageObj = {
      //       _id: lastChatMessage._id,
      //       message: newMessage,
      //       sender: lastChatMessage.sender, time: lastChatMessage.time,
      //       timestamp: lastChatMessage.timestamp
      //     }
      //     // updation in chat messages and last message
      //     chat.messages = [...chat.messages, newMessageObj]
      //     chat.lastMessage = newMessage,
      //       setNewMessage("");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     return;
      //   })
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-4 p-2  bg-purple-600 text-white shadow-lg text-primary-foreground">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Avatar>
          <AvatarImage src={Chat.avatar} alt={Chat.name} />
          <AvatarFallback className="text-black">{Chat.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div> 
          <h2 className="text-xl font-semibold">{Chat.name}</h2>
         {otherUserTyping === true ? (<p>typing...</p>): (<></>)} 
          {
            Chat.isGroup === true ? (
              <p className='text-xs' >{Chat.members?.length} Members</p>
            ) : (
              <></>
            )
          }
        </div>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {chat ? (
            <div key={Chat?._id}>
              {
                Chat?.messages?.map((message) => (
                  <div
                    key={message?._id}
                    className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div className={`max-w-64 md:max-w-lg p-2 break-words whitespace-normal rounded-lg 
                ${message.sender === username ? 'bg-blue-500 text-white' : 'bg-gray-100'
                      }`}
                    >
                      {(chat.isGroup === true && message?.sender !== username) ? (
                        <p className='text-sm font-semibold text-blue-500'>{message.sender} </p>
                      ) : (<></>)}
                      <p className='break-words whitespace-normal text-base' >{message.message}</p>
                      <p className='text-xs font-light flex justify-end'>{message.time}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <></>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            className="flex-grow"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {setNewMessage(e.target.value) ; setTyping(true) ; handletyping()}}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function MainChatBar() {


  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('chats')
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([])
  const [currentUsername, setCurrentUsername] = useState('');
  const [msg , setMsg] = useState("");

  async function getUserChats(username) {
    try {
      await axios.post(getUserChatsUrl, { username: username })
        .then((res) => {
          // console.log(res.data.chats)
          const chats = res.data.chats;
          const formatedChats = chats.map((chat) => {
            let obj = {};
            let name = '';
            if (chat.username1 !== username) {
              name = chat.username1
            } else {
              name = chat.username2
            }

            obj = {
              avatar: "",
              _id: chat._id,
              name: name,
              lastMessage: chat.lastMessage,
              messages: chat.allMessages,
              isGroup: false
            };
            return obj;
          })
          // console.log(formatedChats);
          const sortedChats = sortChats(formatedChats);
          setChats(sortedChats);
          return sortedChats;
        })
        .catch((err) => {
          console.log(err)
        });
    } catch (error) {
      console.log(error)
    }
  }

  async function getUserGroups(username) {
    try {
      await axios.post(getUserGroupsUrl, { username: username })
        .then((res) => {
          // console.log(res.data.groups)
          const groups = res.data.groups;
          const formatedGroups = groups.map((group) => {
            const obj = {
              avatar: "",
              _id: group._id,
              name: group.groupname,
              lastMessage: group.lastMessage,
              messages: group.allMessages,
              isGroup: true,
              members:group.groupmembers,
            };
            return obj;
          })
          // console.log(formatedGroups);
          const sortedGroups = sortChats(formatedGroups);
          setGroups(formatedGroups);
          // setSelectedChat(sortedChats[0]);
        })
        .catch((err) => {
          console.log(err)
        });
    } catch (error) {
      console.log(error)
    }
  }

  const sortChats = (chatsToSort) => {
    return [...chatsToSort].sort((a, b) => {
      const lastMessageA = a.messages.length > 0 ? a.messages[a.messages.length - 1] : { timestamp: 0 };
      const lastMessageB = b.messages.length > 0 ? b.messages[b.messages.length - 1] : { timestamp: 0 };
      return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
    });
  }

  const filteredChats = chats.filter(chat =>
    chat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChatClick = async(chat) => {
    setSelectedChat(null);
    // console.log("changing chat..")
    // setSelectedChat(chat)
    if(chat.isGroup === false){
      await axios.post(getChatByIdUrl , {chatId:chat._id})
      .then((res) => {
        const newChat = {...chat,messages:res.data.chat.allMessages};
        setSelectedChat(newChat)
      })
      .catch((err) => {
        console.log(err);
        setSelectedChat(chat);
      })
    }else{
      await axios.post(getGroupChatByIdUrl , {groupId:chat._id})
      .then((res) => {
        // console.log(chat , res.data.groupChat);
        const newChat = {...chat, messages:res.data.groupChat.allMessages}
        setSelectedChat(newChat);
      })
      .catch((err) => {
        console.log(err);
        setSelectedChat(chat)
      })
    }
  }

  const handleBackClick = () => {
    getUserChats(username)
    setSelectedChat(null)
  }

  const handleCreateGroup = async (e) => {
    setMsg("Group is being created..")
    let currUserName1 ;
    console.log("creating group");
    if(typeof window !== "undefined"){
      setCurrentUsername(localStorage.getItem("username"));
      // setCurrentUserId(localStorage.getItem("userId"));
      currUserName1= localStorage.getItem("username");
    }
    // console.log(currentUsername , newGroupName , selectedContacts)
    try {
      await axios.post(createGroupUrl, 
        {groupname:newGroupName , groupmembers:selectedContacts , createdBy:currUserName1 }
      ).then((res) => {
        // console.log(res.data.group)
        const group = res.data.group;
        const obj = {
          avatar: "",
          _id: group._id,
          name: group.groupname,
          lastMessage: "",
          messages: group.allMessages,
          isGroup: true,
          members:group.groupmembers,
        };
        setGroups(prev => [...prev, obj]);
        setMsg("Group created successfully")
        setTimeout(() => {setIsDialogOpen(false)},1500);
      })
      .catch((err) => {
        console.log(err);
      }) 
    } catch (error) {
      console.log(error)
    }

  }

  const getUser = async (username) => {
    const user = await axios.post(getUserDataUrl , {username:username})
    .then((res) => {
      // console.log(res.data);
      return res.data.user;
    })
    .catch((err) => {
      console.log(err);
      return null;
    })
    // console.log(user);
    // setUser(user);
    if(typeof window !== undefined)
      localStorage.setItem("user" , JSON.stringify(user))
    return user
  }


  useEffect(() => {
    getUser(username);
    getUserChats(username);
    getUserGroups(username);
  }, [])


  return (

    <div className="flex h-[90vh]  overflow-y-clip  overflow-x-clip">
      <div className="w-full md:w-96 flex flex-col border-r">
        <div className="flex justify-between items-center px-4 py-2 bg-purple-600 text-white shadow-lg text-primary-foreground">
          <h1 className="text-xl font-bold px-4">Chat</h1>
          {/* Add group button with dialog  */}
          <Dialog>
              <DialogTrigger className='bg-purple-600 text-white shadow-lg' asChild>
                <Button variant="outline">
                  <Users className="h-5 w-5 " />
                  <span className="sr-only ">New Group</span>
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-white text-black ' >
                <DialogHeader>
                  <p className='text-center text-blue-500 text-sm'>{msg}</p>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="groupName" className="text-right font-semibold text-sm">
                      Group Name
                    </Label>
                    <Input
                      id="groupName"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Select Contacts</Label>
                    {chats.filter(c => !c.isGroup).map((contact) => (
                      <div key={contact._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`contact-${contact._id}`}
                          // checked={selectedContacts.includes(contact.name)}
                          onCheckedChange={(checked) => {
                            setSelectedContacts(
                              checked
                                ? [...selectedContacts, contact.name]
                                : selectedContacts.filter((name) => name !== contact.name)
                            )
                          }}
                        />
                        <Label htmlFor={`contact-${contact._id}`}>{contact.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </DialogContent>
          </Dialog>
        </div>

        <div className="p-4 bg-secondary">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search chats..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="chats" className="flex-grow flex flex-col mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats" onClick={() => setActiveTab('chats')}>Chats</TabsTrigger>
            <TabsTrigger value="groups" onClick={() => setActiveTab('groups')}>Groups</TabsTrigger>
          </TabsList>
          {/* tabcontent for chats  */}
          <TabsContent value="chats" className="flex-grow">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filteredChats.map(chat => (
                <div key={chat._id} className={`flex items-center space-x-4 p-4 ${(selectedChat !== null && selectedChat._id === chat._id) ? "bg-gray-200" : ""}  hover:bg-gray-100 cursor-pointer`} onClick={() => handleChatClick(chat)}>
                  <Avatar>
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>{chat.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{chat.name}</h3>
                    <div className='flex justify-between'>
                      <p className="text-sm text-muted-foreground">{chat.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{chat?.messages[chat.messages.length - 1]?.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          {/* tabcontent for group-chats  */}
          <TabsContent value="groups" className="flex-grow">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {groups.map((group) => (
                <div key={group._id} className={`flex items-center space-x-4 p-4 ${(selectedChat !== null && selectedChat._id === group._id) ? "bg-gray-200" : ""}  hover:bg-gray-100 cursor-pointer`} onClick={() => handleChatClick(group)}>
                  <Avatar>
                    <AvatarImage src={group.avatar} alt={group.name} />
                    <AvatarFallback>{group.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{group.name}</h3>
                    <div className='flex justify-between'>
                      <p className="text-sm text-muted-foreground">{group.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{group?.messages[group.messages.length - 1]?.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden md:block flex-grow">
        {selectedChat ? (
          <ChatView chat={selectedChat} onBack={handleBackClick} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
      {selectedChat && (
        <div className="fixed inset-0 bg-background md:hidden">
          <ChatView chat={selectedChat} onBack={handleBackClick} />
        </div>
      )}
    </div>
  )
}