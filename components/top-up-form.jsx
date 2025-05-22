"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import bkashLogo from "@/public/BKash_Logo_icon-700x662.png"
import nagadLogo from "@/public/Nagad_Logo_full-498x700.png"
import Image from "next/image"

export function TopUpForm({ onSuccess }) {
  const [amount, setAmount] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [slipImage, setSlipImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()
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

      setSlipImage(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!amount || !paymentMethod || (!transactionId && !slipImage && !accountNumber)) {
      toast({
        title: "Error",
        description: "Please fill all fields and upload a slip image",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("amount", amount)
      if (transactionId) formData.append("transactionId", transactionId)
      if (slipImage) formData.append("slipImage", slipImage)
      formData.append("accountNumber", accountNumber)
      formData.append("paymentMethod", paymentMethod)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit top-up request")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Top-up request submitted successfully",
      })

      // Reset form
      setAmount("")
      setTransactionId("")
      setAccountNumber("")
      setPaymentMethod("")
      setSlipImage(null)
      setImagePreview("")

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit top-up request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Balance</CardTitle>
        <CardDescription>
          <ul className="list-disc space-y-1">
            <li>
              বিকাশ বা নগদ দিয়ে পেমেন্ট করতে নিচের যেকোনো একটি নম্বরে টাকা সেন্ড মানি করুন: বিকাশ: 01778368589 / নগদ: 01764450026
            </li>
            <li>যে নম্বর থেকে সেন্ড মানি করলেন, সেই নম্বরটি অ্যাকাউন্ট নম্বর ফিল্ডে লিখুন।</li>
            <li>যত টাকা পাঠিয়েছেন, সেটি Amount (টাকার পরিমাণ) ফিল্ডে লিখুন।</li>
            <li>পেমেন্ট মেথড সিলেক্ট করুন (বিকাশ/নগদ)।</li>
            <li>পেমেন্টের স্ক্রিনশট আপলোড করুন।</li>
            <li>সবশেষে সাবমিট বাটনে ক্লিক করুন।</li>
            <li>✅ ২ ঘণ্টার মধ্যে আপনার রেজিস্ট্রেশন কনফার্ম করা হবে। দেরি হলে আমাদের জানাতে পারেন।</li>
          </ul>
          </CardDescription>
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
                htmlFor="bkash"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${paymentMethod === "bkash" ? "border-primary" : ""
                  }`}
              >
                <RadioGroupItem value="bkash" id="bkash" className="sr-only" />
                <Image
                  src={bkashLogo}
                  alt="bKash"
                  className="h-10 object-contain"
                  width={100}
                  height={100}
                />
                <span className="mt-2 text-sm font-medium">bKash (01778368589)</span>
              </Label>
              <Label
                htmlFor="nagad"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${paymentMethod === "nagad" ? "border-primary" : ""
                  }`}
              >
                <RadioGroupItem value="nagad" id="nagad" className="sr-only" />
                <Image
                  src={nagadLogo}
                  width={100}
                  height={100}
                  alt="Nagad"
                  className="h-10 object-contain"
                />
                <span className="mt-2 text-sm font-medium">Nagad (01764450026)</span>
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
            <p className="text-xs text-muted-foreground">Enter tha Bkash or Nagad account number</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Slip/Screenshot</Label>
            <div
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Payment slip preview"
                    className="max-h-48 mx-auto object-contain"
                  />
                  <p className="text-sm text-muted-foreground">Click to change image</p>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload payment slip</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, or PDF up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Top-up Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
