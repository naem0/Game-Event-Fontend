"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

export function ProfileForm({ user }) {
  const [name, setName] = useState(user.name || "")
  const [phone, setPhone] = useState(user.phone || "")
  const [address, setAddress] = useState(user.address || "")
  const [profileImage, setProfileImage] = useState(user.profileImage || "")
  const [imagePreview, setImagePreview] = useState(user.profileImage || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { update } = useSession()
  const fileInputRef = useRef(null)

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()

      // Update the session
      await update({
        ...user,
        name,
        phone,
        address,
        profileImage: updatedUser.profileImage || user.profileImage,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            {imagePreview && <AvatarImage src={imagePreview} alt={name} />}
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
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
        <p className="text-sm text-muted-foreground">Click the camera icon to upload a profile picture</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user.email || ""} disabled />
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
  )
}
