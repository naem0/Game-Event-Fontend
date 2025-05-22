"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import bkashLogo from "@/public/BKash_Logo_icon-700x662.png"
import nagadLogo from "@/public/Nagad_Logo_full-498x700.png"
import Image from "next/image"

export function WithdrawalForm({ onSuccess }) {
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!amount || !accountNumber || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          accountNumber,
          paymentMethod,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit withdrawal request")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      })

      // Reset form
      setAmount("")
      setAccountNumber("")
      setPaymentMethod("")

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit withdrawal request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Balance</CardTitle>
        <CardDescription>Submit a withdrawal request to your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
              <Label
                htmlFor="bkash-withdraw"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  paymentMethod === "bkash" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="bkash" id="bkash-withdraw" className="sr-only" />
                <Image
                  src={bkashLogo}
                  alt="bKash"
                  className="h-10 object-contain"
                  width={100}
                  height={100}
                />
                <span className="mt-2 text-sm font-medium">bKash</span>
              </Label>
              <Label
                htmlFor="nagad-withdraw"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  paymentMethod === "nagad" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value="nagad" id="nagad-withdraw" className="sr-only" />
                <Image
                  src={nagadLogo}
                  width={100}
                  height={100}
                  alt="Nagad"
                  className="h-10 object-contain"
                />
                <span className="mt-2 text-sm font-medium">Nagad</span>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit Withdrawal Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
