'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, Bot, MessageCircle, Heart, Brain, Smile, ArrowRight, LogIn, ChevronLeft, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const welcomeMessages = [
  "Welcome to TheraWin",
  "थेराविन में आपका स्वागत है",
  "セラウィンへようこそ"
]

const features = [
  { 
    icon: Video, 
    title: "Video Calling", 
    description: "Connect face-to-face with therapists", 
    color: "bg-pink-100 text-pink-900",
    image: "/assets/videoCall.png",
    details: "Experience high-quality, secure video sessions with licensed therapists from the comfort of your home. Our advanced platform ensures smooth, lag-free conversations, allowing you to focus on your mental well-being."
  },
  { 
    icon: Bot, 
    title: "TheraWin ChatBot", 
    description: "24/7 AI-powered support", 
    color: "bg-green-100 text-green-900",
    image: '/assets/chatBot.png',
    details: "Our AI-powered ChatBot is always here for you, providing instant support, coping strategies, and personalized recommendations. It's like having a supportive friend in your pocket, ready to help at any time of day or night."
  },
  { 
    icon: MessageCircle, 
    title: "Chat with Friends", 
    description: "Build a supportive community", 
    color: "bg-yellow-100 text-yellow-900",
    image: "/assets/personal.png",
    details: "Connect with like-minded individuals in our moderated, safe chat rooms. Share experiences, offer support, and build lasting friendships with people who understand your journey. Together, we're stronger."
  }
]

const benefits = [
  { icon: Heart, title: "Improved Well-being", description: "Enhance your mental health" },
  { icon: Brain, title: "Personal Growth", description: "Develop new coping skills" },
  { icon: Smile, title: "Increased Happiness", description: "Find more joy in daily life" }
]

const testimonials = [
  { name: "Sarah K.", text: "TheraWin has been a game-changer for my mental health. The video sessions are so convenient, and the therapists are amazing!", rating: 5 },
  { name: "Michael R.", text: "I was skeptical at first, but the AI ChatBot has been incredibly helpful during late-night anxiety attacks. Highly recommend!", rating: 4 },
  { name: "Emily T.", text: "The community here is so supportive. I've made friends who truly understand what I'm going through. Thank you, TheraWin!", rating: 5 }
]

export default function Component() {

  const router = useRouter();
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const [welcomeIndex, setWelcomeIndex] = useState(0)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if(typeof window !== "undefined"){
        setCurrentUsername(localStorage.getItem("username"));
        setCurrentUserId(localStorage.getItem("userId"));
    }
    // console.log(currentUsername, currentUserId)
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeIndex((prevIndex) => (prevIndex + 1) % welcomeMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white">
      { 
        (!currentUsername || !currentUserId) ? (
          <header className="p-4 sm:p-6 flex justify-between items-center">
          {selectedFeature && (
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedFeature(null)}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Back</span>
            </Button>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold">TheraWin</h1>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none rounded-full px-3 sm:px-6 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 group transition-all duration-300 ease-in-out text-xs sm:text-sm"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {router.push('/login')}}
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? 0 : "-100%" }}
                transition={{ duration: 0.3 }}
              />
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:text-purple-700 transition-colors duration-300" />
              <span className="relative z-10 group-hover:text-purple-700 transition-colors duration-300">Login</span>
            </Button>
          </motion.div>
          </header>
        ) : (
          <></>
        )
      }

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {!selectedFeature ? (
          <>
            <section className="text-center mb-12 sm:mb-16">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={welcomeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6"
                >
                  {welcomeMessages[welcomeIndex]}
                </motion.h2>
              </AnimatePresence>
              <p className="text-lg sm:text-xl md:text-2xl">Your journey to better mental health starts here</p>
            </section>

            <section className="mb-16">
              <h3 className="text-2xl md:text-3xl font-semibold mb-6">Our Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedFeature(feature)}
                  >
                    <Card className={`${feature.color} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <feature.icon className="w-12 h-12" />
                          <ArrowRight className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                        <p className="opacity-80">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <h3 className="text-2xl md:text-3xl font-semibold mb-6">Benefits of TheraWin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-6">
                        <benefit.icon className="w-12 h-12 mb-4 text-purple-300" />
                        <h4 className="text-xl font-semibold mb-2">{benefit.title}</h4>
                        <p className="text-purple-200">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="mb-16" ref={ref}>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={itemVariants}
                className="text-2xl md:text-3xl font-semibold mb-6"
              >
                What Our Users Say
              </motion.h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={controls}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    variants={itemVariants}
                    custom={index}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <CardContent className="p-6 relative">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <p className="mb-4 italic relative z-10">{testimonial.text}</p>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center relative z-10"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <span className="font-semibold">{testimonial.name}</span>
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                              >
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <Button onClick={() => {router.push('/signup')}} size="lg" className="bg-white text-purple-900 hover:bg-purple-100 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Get Started Now
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{selectedFeature.title}</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Image
                  src={selectedFeature.image}
                  alt={selectedFeature.title}
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <p className="text-lg mb-4">{selectedFeature.details}</p>
                <Button className="bg-white text-purple-900 hover:bg-purple-100">
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="bg-purple-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 TheraWin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}