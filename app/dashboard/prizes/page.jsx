import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrizeRequestForm } from "@/components/prize-request-form"
import { PrizeRequestHistory } from "@/components/prize-request-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function PrizesPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Prize Money</h1>

      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">Request Prize</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
        </TabsList>
        <TabsContent value="request">
          <PrizeRequestForm />
        </TabsContent>
        <TabsContent value="history">
          <PrizeRequestHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
