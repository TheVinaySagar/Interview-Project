"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserInterviews } from "@/components/user-interviews"
import { UserSettings } from "@/components/user-settings"
import { Edit, Mail } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  bio: string
  urls: {
    github: string
    linkedin: string
  }
  createdAt?: string
  interviewsCount?: number
  likesCount?: number
  commentsCount?: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
      })

      if (!response.ok) throw new Error('Failed to update profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Please log in to view your profile</div>
  }

  const memberSince = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  }) : 'N/A'

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt={profile.name} />
                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <Mail className="mr-1 h-3 w-3" />
                  {profile.email}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" size="sm" onClick={() => document.querySelector('[value="settings"]')?.click()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interviews Shared</span>
                <span className="font-medium">{profile.interviewsCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Likes</span>
                <span className="font-medium">{profile.likesCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Comments</span>
                <span className="font-medium">{profile.commentsCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">{memberSince}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Tabs defaultValue="interviews">
            <TabsList className="mb-6">
              <TabsTrigger value="interviews">My Interviews</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="interviews">
              <UserInterviews />
            </TabsContent>
            <TabsContent value="settings">
              <UserSettings onProfileUpdate={handleProfileUpdate} initialData={profile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
