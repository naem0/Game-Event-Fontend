"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { CopyIcon, Share2Icon, CheckIcon } from "lucide-react"

export function ReferralSystem() {
  const { data: session } = useSession()
  const [inviteLink, setInviteLink] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [referralStats, setReferralStats] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchInviteLink()
      fetchReferralStats()
    }
  }, [session])

  const fetchInviteLink = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/referrals/invite`, {
        headers: {
          Authorization: `Bearer ${session.user.id}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get invite link")
      }

      const data = await response.json()
      setInviteLink(data.inviteLink)
      setReferralCode(data.referralCode)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invite link",
        variant: "destructive",
      })
    }
  }

  const fetchReferralStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/referrals/stats`, {
        headers: {
          Authorization: `Bearer ${session.user.id}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get referral stats")
      }

      const data = await response.json()
      setReferralStats(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load referral stats",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Invitation link copied to clipboard",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on our platform",
          text: "Use my referral link to sign up!",
          url: inviteLink,
        })

        toast({
          title: "Shared!",
          description: "Thanks for sharing your invite",
        })
      } catch (error) {
        if (error.name !== "AbortError") {
          toast({
            title: "Error",
            description: "Couldn't share the invite link",
            variant: "destructive",
          })
        }
      }
    } else {
      copyToClipboard(inviteLink)
    }
  }

  if (loading) {
    return <div>Loading referral information...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite Friends</CardTitle>
          <CardDescription>Share your unique referral link and earn 20 taka for each new registration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Your Referral Code</p>
              <div className="flex items-center space-x-2">
                <div className="bg-muted p-2 rounded-md font-mono text-sm flex-1">{referralCode}</div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(referralCode)}>
                  {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Your Invitation Link</p>
              <div className="flex items-center space-x-2">
                <div className="bg-muted p-2 rounded-md font-mono text-sm truncate flex-1">{inviteLink}</div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(inviteLink)}>
                  {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={shareInvite} className="w-full">
            <Share2Icon className="mr-2 h-4 w-4" />
            Share Invitation
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Stats</CardTitle>
          <CardDescription>Your current balance and referral history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
              <p className="text-3xl font-bold">{referralStats?.referralCount || 0}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p className="text-3xl font-bold">{referralStats?.balance || 0} Taka</p>
            </div>
          </div>

          {referralStats?.referrals?.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">People You've Invited</h3>
              <div className="space-y-4">
                {referralStats.referrals.map((referral) => (
                  <div key={referral._id} className="flex items-center space-x-4">
                    <Avatar>
                      {referral.profileImage ? (
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${referral.profileImage}`}
                          alt={referral.name}
                        />
                      ) : (
                        <AvatarFallback>{referral.name.charAt(0).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{referral.name}</p>
                      <p className="text-xs text-muted-foreground">{referral.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(referral.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>You haven't referred anyone yet</p>
              <p className="text-sm">Share your invitation link to start earning rewards!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
