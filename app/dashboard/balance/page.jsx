import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { TopUpForm } from "@/components/top-up-form"
import { WithdrawalForm } from "@/components/withdrawal-form"
import { TransferForm } from "@/components/transfer-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function BalancePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Balance Management</h1>

      <Tabs defaultValue="topup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="topup">Top Up</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
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
