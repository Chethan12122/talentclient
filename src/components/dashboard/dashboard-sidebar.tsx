"use client"

import { useRouter, usePathname } from "next/navigation"
import { User, Trophy, Calendar, History, Users, BarChart3, Flag, LogOut, Home } from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { logout } from "@/services/auth.api"
import { deleteCookie } from "cookies-next"

interface DashboardSidebarProps {
  userRole: "ATHLETE" | "REFEREE" | "TEAM MANAGER"
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double-clicks

    setIsLoggingOut(true)

    try {
      console.log("Starting logout process...")

      // Set a timeout to ensure we don't hang forever
      const logoutPromise = logout()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Logout timeout')), 10000)
      )

      await Promise.race([logoutPromise, timeoutPromise])
      console.log("Logout completed successfully")

    } catch (error) {
      console.error("Logout error:", error)

      // Force clear all authentication cookies locally
      const cookieOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      }

      try {
        deleteCookie("access_token", cookieOptions)
        deleteCookie("refresh_token", cookieOptions)
        deleteCookie("user_role", cookieOptions)
        console.log("Cookies cleared manually")
      } catch (cookieError) {
        console.error("Error clearing cookies:", cookieError)
      }
    } finally {
      setIsLoggingOut(false)
      // Always redirect to login regardless of logout success/failure
      router.push("/login")
      // Force page reload to clear any cached state
      setTimeout(() => window.location.href = "/login", 100)
    }
  }

  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        icon: Home,
        href: `/dashboard/${userRole.toLowerCase().replace(/[^a-z]/g, "")}`,
      },
    ]

    switch (userRole) {
      case "ATHLETE":
        return [
          ...baseItems,
          {
            title: "Profile",
            icon: User,
            href: "/dashboard/athlete/profile",
          },
          {
            title: "Upcoming Competitions",
            icon: Calendar,
            href: "/dashboard/athlete/competitions",
          },
          {
            title: "Competition History",
            icon: History,
            href: "/dashboard/athlete/history",
          },
          {
            title: "Achievements",
            icon: Trophy,
            href: "/dashboard/athlete/achievements",
          },
        ]

      case "REFEREE":
        return [
          ...baseItems,
          {
            title: "Profile",
            icon: User,
            href: "/dashboard/referee/profile",
          },
          {
            title: "Events",
            icon: Flag,
            href: "/dashboard/referee/events",
          },
          {
            title: "Upcoming Matches",
            icon: Calendar,
            href: "/dashboard/referee/matches",
          },
          {
            title: "Match History",
            icon: History,
            href: "/dashboard/referee/history",
          },
          {
            title: "Assignments",
            icon: Flag,
            href: "/dashboard/referee/assignments",
          },
        ]

      case "TEAM MANAGER":
        return [
          ...baseItems,
          {
            title: "Institution Profile",
            icon: User,
            href: "/dashboard/teammanager/profile",
          },
          {
            title: "Students",
            icon: Users,
            href: "/dashboard/teammanager/students",
          },
          {
            title: "Institution Ranking",
            icon: BarChart3,
            href: "/dashboard/teammanager/ranking",
          },
          {
            title: "Competitions",
            icon: Trophy,
            href: "/dashboard/teammanager/competitions",
          },
        ]

      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Sports Platform</p>
            <p className="text-xs text-muted-foreground">
              {userRole === "ATHLETE" && "Athlete Portal"}
              {userRole === "REFEREE" && "Referee Portal"}
              {userRole === "TEAM MANAGER" && "Manager Portal"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <a href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}