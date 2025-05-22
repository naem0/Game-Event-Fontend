"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TopUpForm } from "@/components/top-up-form"
import { WithdrawalForm } from "@/components/withdrawal-form"
import { TransferForm } from "@/components/transfer-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BalanceFormSkeleton } from "@/components/balance-form-skeleton"

export default function BalancePage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== "loading") {
      // Short timeout to ensure smooth transition
      const timer = setTimeout(() => {
        setLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [status])

  if (loading) {
    return <BalanceFormSkeleton />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Balance Management</h1>

      <Tabs defaultValue="topup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topup">Top Up</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          {/* <TabsTrigger value="transfer">Transfer</TabsTrigger> */}
        </TabsList>
        <TabsContent value="topup">
          <TopUpForm />
        </TabsContent>
        <TabsContent value="withdraw">
          <WithdrawalForm />
        </TabsContent>
        <TabsContent value="transfer">
          <TransferForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
