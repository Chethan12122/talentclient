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

        {/* Desktop Animations */}
        {!isMobile && (
          <>
            {/* 🏀 Basketball */}
            <div className="absolute top-20 left-10 animate-bounce">
              <div className="w-16 h-16 bg-orange-500 rounded-full border-4 border-orange-600 opacity-30 shadow-lg" />
            </div>

            {/* ⚽ Soccer Ball */}
            <div className="absolute top-32 right-10 animate-spin" style={{ animationDuration: '6s' }}>
              <div className="w-14 h-14 bg-black rounded-full opacity-20 relative shadow-lg">
                <div className="absolute inset-2 border-2 border-white rounded-full" />
                <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>

            {/* 🎾 Tennis Ball */}
            <div className="absolute bottom-32 left-20 animate-bounce">
              <div className="w-12 h-12 bg-green-400 rounded-full opacity-30 border-2 border-green-600" />
            </div>

            {/* 🏆 Trophy */}
            <div className="absolute top-40 right-20 animate-pulse">
              <div className="w-12 h-16 bg-yellow-400 rounded-t-lg opacity-40">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </>
        )}

        {/* ================= MOBILE ANIMATIONS ================= */}
        {isMobile && (
          <>
            {/* 🔵 Floating Dots */}
            <div className="absolute top-10 left-1/4 animate-bounce-slow">
              <div className="w-4 h-4 bg-blue-400 rounded-full opacity-40 shadow-sm" />
            </div>
            <div className="absolute top-1/3 right-1/3 animate-bounce-slow delay-150">
              <div className="w-3 h-3 bg-indigo-400 rounded-full opacity-30 shadow-sm" />
            </div>
            <div className="absolute bottom-20 left-1/3 animate-bounce-slow delay-300">
              <div className="w-5 h-5 bg-purple-400 rounded-full opacity-35 shadow-sm" />
            </div>

            {/* ✨ Floating Stars */}
            <div className="absolute top-1/2 right-1/4 animate-pulse-slow">
              <div className="w-2 h-2 bg-yellow-300 rounded-full opacity-50" />
            </div>
            <div className="absolute bottom-1/4 left-1/2 animate-pulse-slow delay-200">
              <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-50" />
            </div>
          </>
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

      {/* ================= EXTRA ANIMATION CLASSES ================= */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }

        .delay-150 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  )
}
