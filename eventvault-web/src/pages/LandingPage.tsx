import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()
  
  // Image carousel state
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselImages = [
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=600&fit=crop'
  ]

  // Trust badge counter state
  const [counters, setCounters] = useState({
    events: 0,
    tickets: 0,
    users: 0,
    organizers: 0
  })

  // Testimonial carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Organizer",
      text: "EventVault transformed how we manage our concerts. The escrow system gives our attendees peace of mind.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Concert Goer",
      text: "Finally, a platform that protects ticket buyers. The dynamic QR codes make me feel secure about my purchases.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      name: "Emma Williams",
      role: "Venue Manager",
      text: "The agent invitation system streamlined our gate operations. Offline verification is a game-changer.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ]

  // News ticker state
  const newsItems = [
    "EventVault launches new AI-powered ticket customization feature",
    "Partnership with major concert venues announced",
    "Mobile app now available on iOS and Android",
    "New security features implemented for high-profile events",
    "Escrow system successfully protects 10,000+ ticket purchases"
  ]

  // Auto-increment counters
  useEffect(() => {
    const targetValues = {
      events: 15420,
      tickets: 892000,
      users: 245000,
      organizers: 3200
    }

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const incrementCounter = () => {
      setCounters(prev => {
        const newCounters = { ...prev }
        Object.keys(targetValues).forEach(key => {
          const increment = targetValues[key as keyof typeof targetValues] / steps
          newCounters[key as keyof typeof newCounters] = Math.min(
            Math.floor(newCounters[key as keyof typeof newCounters] + increment),
            targetValues[key as keyof typeof targetValues]
          )
        })
        return newCounters
      })
    }

    const timer = setInterval(incrementCounter, interval)
    return () => clearInterval(timer)
  }, [])

  // Auto-rotate image carousel
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(slideInterval)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(testimonialInterval)
  }, [])

  // Auto-scroll news ticker
  const [newsOffset, setNewsOffset] = useState(0)
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      setNewsOffset(prev => (prev - 1) % (newsItems.length * 300))
    }, 30)
    return () => clearInterval(scrollInterval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950">
      {/* News Ticker Section */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 overflow-hidden py-2">
        <div className="whitespace-nowrap animate-marquee">
          <div 
            className="inline-block"
            style={{ transform: `translateX(${newsOffset}px)` }}
          >
            {newsItems.map((item, index) => (
              <span key={index} className="inline-block px-8 text-emerald-400 text-sm">
                <i className="fas fa-bullhorn mr-2"></i>{item}
              </span>
            ))}
            {newsItems.map((item, index) => (
              <span key={`dup-${index}`} className="inline-block px-8 text-emerald-400 text-sm">
                <i className="fas fa-bullhorn mr-2"></i>{item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Carousel Background */}
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Event ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-emerald-900/80 to-slate-950/95" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                EventVault
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              The secure ticket reservation platform that protects both organizers and attendees. 
              Experience the future of event management with our escrow-powered system.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-100 font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30">
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 transition-all duration-300">
                Learn More
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-slate-800 text-emerald-400 font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 border border-emerald-500/30"
              >
                <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-slate-800 text-emerald-400 font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 border border-emerald-500/30"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>Auth Forms
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-12">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-emerald-400 w-8' : 'bg-emerald-400/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Events Hosted', value: counters.events, icon: 'fa-calendar-days' },
              { label: 'Tickets Sold', value: counters.tickets, icon: 'fa-ticket' },
              { label: 'Active Users', value: counters.users, icon: 'fa-users' },
              { label: 'Organizers', value: counters.organizers, icon: 'fa-bullseye' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-3 text-emerald-400"><i className={`fas ${stat.icon}`}></i></div>
                <div className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Testimonials */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Why Choose <span className="text-emerald-400">EventVault</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge security with user-friendly design to revolutionize event ticketing.
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-slate-700 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-24 h-24 rounded-full border-4 border-emerald-500/30 object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <p className="text-xl text-slate-300 mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div>
                    <h4 className="text-slate-100 font-semibold text-lg">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-emerald-400 text-sm">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-emerald-400 w-6' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Propaganda Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
                Take Events <span className="text-emerald-400">Anywhere</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Download the EventVault mobile app and access your tickets anytime, anywhere. 
                Features include offline ticket verification, dynamic QR codes, and real-time updates.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 cursor-pointer">
                  <i className="fab fa-apple text-2xl fa-2x"></i>
                  <div className="text-left">
                    <div className="text-xs text-slate-400">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-blue-50 transition-all duration-300 border border-slate-900 cursor-pointer">
                  <i className="fab fa-google-play fa-2x"></i>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Get it on</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-gradient-to-b from-emerald-600 to-emerald-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4"><i className="fas fa-ticket text-white" ></i></div>
                    <div className="text-white font-bold text-xl mb-2">EventVault</div>
                    <div className="text-emerald-200 text-sm">Your Ticket, Your Way</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm">
            &copy; 2024 EventVault. All rights reserved. Secure ticketing for the future.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
