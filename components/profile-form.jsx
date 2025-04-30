"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileSkeleton } from "@/components/profile-skeleton"

export function ProfileForm() {
  const [userData, setUserData] = useState(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()
  const { data: session, update } = useSession()
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUserData(data)
      setName(data.name || "")
      setPhone(data.phone || "")
      setAddress(data.address || "")
      setProfileImage(data.profileImage || "")
      setImagePreview(data.profileImage || "")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      setProfileImage(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("name", name)
      formData.append("phone", phone)
      formData.append("address", address)

      if (profileImage && profileImage instanceof File) {
        formData.append("profileImage", profileImage)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()

      // Update the session
      await update({
        ...session.user,
        name,
        phone,
        address,
        profileImage: updatedUser.profileImage || userData.profileImage,
      })

      // Update local state
      setUserData({
        ...userData,
        name,
        phone,
        address,
        profileImage: updatedUser.profileImage || userData.profileImage,
      })

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (isLoadingData) {
    return <ProfileSkeleton />
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current account balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userData?.balance || 0} Taka</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Code</CardTitle>
            <CardDescription>Share this code with friends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{userData?.referralCode || "N/A"}</div>
            <p className="text-sm text-muted-foreground mt-2">You've referred {userData?.referralCount || 0} users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {imagePreview && <AvatarImage src={imagePreview || "/placeholder.svg"} alt={name} />}
                  <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-sm text-muted-foreground">Click the camera icon to upload a profile picture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Account Balance</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xl font-bold">{userData?.balance || 0} Taka</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Referral Code</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-lg font-semibold">{userData?.referralCode || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={userData?.email || ""} disabled />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
