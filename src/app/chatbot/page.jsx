'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Send, User, ChevronLeft } from 'lucide-react'
import axios from 'axios'
const backendurl = "https://chat-backend-rx0j.onrender.com";
const chatbotUrl = `${backendurl}/api/chatbot/`

export default function Component() {
//   const router = useRouter()
//   if(typeof window !== 'undefined'){
// const user= localStorage.getItem("username")

//   }
  // useEffect(()=>{
  //   let LoginedUser;
  //   if(typeof window !== 'undefined'){
  //   LoginedUser = localStorage.getItem("username");
  //   }
  //   if(!LoginedUser){
  //     router.push('/login')
  //   }
  // },[router])

  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! How can I assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  function parseMarkdown(text) {
    // Replace **text** with <strong>text</strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    // Replace *text* with <em>text</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
    // Replace `text` with <code>text</code>
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
    // Replace [text](url) with <a href="url">text</a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
    return html;
  }

  const handleSendMessage = async (e) => {
    // e.preventDefault();
    if (input.trim()) {
      const newMessage = { id: messages.length + 1, content: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');
      
      // Simulate bot response
      await axios.post(chatbotUrl, {
        prompt:input
      })
      .then((res) => {
        // console.log(res.data);
        const html = parseMarkdown(res.data);
        const newMsg = {
            id: Math.random(), content : html, sender:'bot'
        }
        setMessages(prev => [...prev , newMsg]);
      })
      .catch((err) => {
        console.log(err);
      })
    //   setTimeout(() => {
    //     const botResponse = { 
    //       id: messages.length + 2, 
    //       content: "I'm here to help! How are you feeling today?", 
    //       sender: 'bot' 
    //     };
    //     setMessages(prevMessages => [...prevMessages, botResponse]);
    //   }, 1000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col">
      <header className="p-2 sm:p-2 flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => {/* Handle navigation */}}
        >
         
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">TheraWin ChatBot</h1>
        <div className="w-10 sm:w-12"></div> {/* Placeholder for alignment */}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
        <Card className="bg-white/10 backdrop-blur-md border-white/20 flex-grow overflow-hidden flex flex-col">
          <CardContent className="p-4 flex-grow overflow-y-auto " style={{ height: 'calc(100% - 70px)' }}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-end ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`rounded-full p-2 ${message.sender === 'user' ? 'bg-purple-500' : 'bg-green-500'}`}>
                      {message.sender === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                    </div>
                    <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                      message.sender === 'user' ? 'bg-purple-600 mr-2' : 'bg-purple-800 ml-2'
                    }`}>
                      <div>
                        <div 
                          dangerouslySetInnerHTML={{ __html: message.content }}
                           style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 bg-purple-800">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-grow bg-purple-700 text-white placeholder-purple-300 rounded-l-full py-2 px-4 outline-none"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-green-500 hover:bg-green-600 text-white rounded-r-full"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <footer className="bg-purple-800 text-white py-4 text-center">
        <p>&copy; 2024 TheraWin. All rights reserved.</p>
      </footer>
    </div>
  )
}