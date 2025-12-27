'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 relative overflow-hidden">

      {/* ================= BACKGROUND ANIMATIONS ================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* 🏀 Basketball */}
        {!isMobile && (
          <div className="absolute top-20 left-10 animate-bounce">
            <div className="w-16 h-16 bg-orange-500 rounded-full border-4 border-orange-600 opacity-30 shadow-lg" />
          </div>
        )}

        {/* ⚽ Soccer Ball */}
        {!isMobile && (
          <div className="absolute top-32 right-10 animate-spin" style={{ animationDuration: '6s' }}>
            <div className="w-14 h-14 bg-black rounded-full opacity-20 relative shadow-lg">
              <div className="absolute inset-2 border-2 border-white rounded-full" />
              <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        )}

        {/* 🎾 Tennis Ball */}
        {!isMobile && (
          <div className="absolute bottom-32 left-20 animate-bounce">
            <div className="w-12 h-12 bg-green-400 rounded-full opacity-30 border-2 border-green-600" />
          </div>
        )}

        {/* 🏆 Trophy */}
        {!isMobile && (
          <div className="absolute top-40 right-20 animate-pulse">
            <div className="w-12 h-16 bg-yellow-400 rounded-t-lg opacity-40">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mt-2" />
            </div>
          </div>
        )}

        {/* 🥇 Medal */}
        {!isMobile && (
          <div className="absolute top-60 left-1/2 animate-pulse">
            <div className="w-10 h-10 bg-yellow-300 rounded-full opacity-30 border-2 border-yellow-500" />
          </div>
        )}

        {/* 🏃 Athlete */}
        {!isMobile && (
          <div className="absolute bottom-40 right-1/3 animate-bounce">
            <div className="w-4 h-6 bg-green-500 rounded-t relative">
              <div className="absolute -top-1 left-1 w-2 h-2 bg-green-600 rounded-full" />
              <div className="absolute -top-3 left-0 w-1 h-2 bg-green-600 rounded-full" />
              <div className="absolute -top-3 right-0 w-1 h-2 bg-green-600 rounded-full" />
            </div>
          </div>
        )}

        {/* 🏊 Swimming */}
        {!isMobile && (
          <div className="absolute top-3/4 left-1/3 animate-pulse">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-3 bg-cyan-500 rounded" />
              <div className="w-4 h-2 bg-cyan-500 rounded-full" />
              <div className="w-2 h-3 bg-cyan-500 rounded" />
            </div>
          </div>
        )}

        {/* ⏱ Stopwatch */}
        {!isMobile && (
          <div className="absolute top-1/2 left-5 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="w-8 h-8 bg-gray-600 rounded-full opacity-20 border-2 border-gray-700 relative">
              <div className="absolute top-1 left-1/2 w-0.5 h-3 bg-red-500 transform -translate-x-1/2 origin-bottom" />
              <div className="absolute top-1 left-1/2 w-0.5 h-2 bg-black transform -translate-x-1/2 origin-bottom rotate-90" />
            </div>
          </div>
        )}

        {/* 🏋️ Weight Bar */}
        {!isMobile && (
          <div className="absolute top-3/4 right-5 animate-pulse">
            <div className="w-20 h-1 bg-gray-400 opacity-30 relative">
              <div className="absolute -left-1 top-1/2 w-2 h-4 bg-gray-500 transform -translate-y-1/2 rounded" />
              <div className="absolute -right-1 top-1/2 w-2 h-4 bg-gray-500 transform -translate-y-1/2 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Talent Development</h1>
          <div className="flex gap-4">
            <Link href="/authpage/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/authpage/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900">
          Welcome to Talent Development Platform
        </h2>

        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          Discover, develop, and showcase athletic talent through our comprehensive platform designed for athletes, referees, and team managers.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link href="/authpage/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/authpage/login">
            <Button size="lg" variant="outline">Sign In</Button>
          </Link>
        </div>
      </main>

      {/* ================= FEATURES ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Athlete Management', desc: 'Track performance, achievements, and competitions.' },
            { title: 'Referee Tools', desc: 'Manage events, scan QR codes, and oversee competitions.' },
            { title: 'Team Management', desc: 'Organize teams, track rankings, and manage athletes.' }
          ].map((item, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-md hover:shadow-xl transition">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
