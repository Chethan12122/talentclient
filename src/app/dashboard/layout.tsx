"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

// Direct cookie reading function for layout
function getClientCookie(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userRole, setUserRole] = useState<"ATHLETE" | "REFEREE" | "TEAM MANAGER" | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAuth() {
      console.log("🔍 Dashboard Layout: Starting auth check...")
      console.log("🔍 Current pathname:", pathname)
      
      // Direct cookie check
      const accessToken = getClientCookie("access_token");
      const storedRole = getClientCookie("user_role");
      
      console.log("🔍 Access token exists:", !!accessToken)
      console.log("🔍 Stored role:", storedRole)
      console.log("🔍 All cookies:", document.cookie)
      
      if (!accessToken) {
        console.log("❌ Not authenticated, redirecting to login")
        router.push("/authpage/login")
        return
      }

      if (!storedRole || !["ATHLETE", "REFEREE", "TEAM MANAGER"].includes(storedRole)) {
        console.log("❌ No valid role found, redirecting to login")
        setError("No valid user role found. Please login again.")
        setTimeout(() => {
          router.push("/authpage/login")
        }, 2000)
        return
      }
      
      console.log("✅ Setting user role:", storedRole)
      setUserRole(storedRole as "ATHLETE" | "REFEREE" | "TEAM MANAGER")
      
      // Only redirect if user is on the base /dashboard route
      if (pathname === "/dashboard") {
        const dashboardPaths = {
          'ATHLETE': '/dashboard/athlete',
          'REFEREE': '/dashboard/referee',
          'TEAM MANAGER': '/dashboard/teammanager'
        };
        const targetPath = dashboardPaths[storedRole as keyof typeof dashboardPaths];
        console.log("🔄 Redirecting from /dashboard to:", targetPath)
        router.replace(targetPath)
      } else {
        console.log("✅ User is on correct path:", pathname)
      }
      
      setLoading(false)
    }

    // Small delay to ensure cookies are fully set
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router, pathname])

  console.log("🎨 Render state:", { loading, error, userRole, pathname })

  if (loading) {
    console.log("🔄 Rendering loading state")
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
          <p className="text-xs text-muted-foreground mt-2">Path: {pathname}</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.log("❌ Rendering error state:", error)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => router.push("/authpage/login")} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!userRole) {
    console.log("❌ Rendering no role state")
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No user role found</p>
          <button 
            onClick={() => router.push("/authpage/login")} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Login Again
          </button>
        </div>
      </div>
    )
  }

  console.log("✅ Rendering dashboard with role:", userRole)
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar userRole={userRole} />
          <div className="flex-1">
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
                <SidebarTrigger />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">
                    {userRole === "ATHLETE" && "Athlete Dashboard"}
                    {userRole === "REFEREE" && "Referee Dashboard"}
                    {userRole === "TEAM MANAGER" && "Team Manager Dashboard"}
                  </h1>
                </div>
              </div>
            </header>
            <main className="flex-1 p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
