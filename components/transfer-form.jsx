"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function TransferForm({ onSuccess }) {
  const [amount, setAmount] = useState("")
  const [recipientNumber, setRecipientNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!amount || !recipientNumber) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          recipientNumber,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to transfer money")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Money transferred successfully",
      })

      // Reset form
      setAmount("")
      setRecipientNumber("")

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to transfer money",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
        <CardDescription>Send money to another user's account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientNumber">Recipient's Phone Number</Label>
            <Input
              id="recipientNumber"
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
              placeholder="Enter recipient's phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Taka)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Transfer Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
