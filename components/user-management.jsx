"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { Eye, UserCheck, UserX, Loader2 } from "lucide-react"

export function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePromoteUser = async () => {
    if (!selectedUser) return
    setProcessingAction(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${selectedUser._id}/promote`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to promote user")
      }

      setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, role: "admin" } : user)))

      toast({
        title: "Success",
        description: `${selectedUser.name} has been promoted to admin`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
      setDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleToggleSuspension = async (user, suspend) => {
    setSelectedUser(user)
    setProcessingAction(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user._id}/suspend`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ suspend }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to update user status")
      }

      setUsers(users.map((u) => (u._id === user._id ? { ...u, isSuspended: suspend } : u)))

      toast({
        title: "Success",
        description: `User ${suspend ? "suspended" : "unsuspended"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
      setSelectedUser(null)
    }
  }

  const openPromoteDialog = (user) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const openUserDetails = async (user) => {
    setSelectedUser(user)
    setLoadingDetails(true)
    setDetailsDialogOpen(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user._id}/details`, {
        headers: {
          Authorization: `Bearer ${session?.user.apiToken}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch user details")
      }
      const data = await response.json()
      setUserDetails(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load user details",
        variant: "destructive",
      })
      setDetailsDialogOpen(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>{user.balance} Taka</TableCell>
              <TableCell>
                {user.isSuspended ? (
                  <Badge variant="destructive">Suspended</Badge>
                ) : (
                  <Badge variant="outline">Active</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openUserDetails(user)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  {user.role === "user" && (
                    <Button variant="outline" size="sm" onClick={() => openPromoteDialog(user)}>
                      Promote
                    </Button>
                  )}
                  {user.isSuspended ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleSuspension(user, false)}
                      disabled={processingAction && selectedUser?._id === user._id}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Unsuspend
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleToggleSuspension(user, true)}
                      disabled={processingAction && selectedUser?._id === user._id}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Promote Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote User</DialogTitle>
            <DialogDescription>
              Are you sure you want to promote {selectedUser?.name} to admin? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processingAction}>
              Cancel
            </Button>
            <Button onClick={handlePromoteUser} disabled={processingAction}>
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Promote"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
            <DialogDescription>Detailed information about this user</DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading user details...</span>
            </div>
          ) : userDetails ? (
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
                <TabsTrigger value="prizes">Prizes</TabsTrigger>
                <TabsTrigger value="topups">Top-ups</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{userDetails.user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{userDetails.user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                        <p className="capitalize">{userDetails.user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p>{userDetails.user.isSuspended ? "Suspended" : "Active"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Balance</p>
                        <p>{userDetails.user.balance} Taka</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Referral Balance</p>
                        <p>{userDetails.user.pendingReferralBalance || 0} Taka</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Referral Count</p>
                        <p>{userDetails.user.referralCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Joined</p>
                        <p>{format(new Date(userDetails.user.createdAt), "PPP")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">Total Prize Money</p>
                        <p className="text-2xl font-bold">{userDetails?.stats?.totalPrize} Taka</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">Total Top-ups</p>
                        <p className="text-2xl font-bold">{userDetails?.stats?.totalTopUp} Taka</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">Tournaments Joined</p>
                        <p className="text-2xl font-bold">{userDetails?.stats?.tournamentCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All financial transactions for this user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userDetails.transactions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails.transactions.map((transaction) => (
                            <TableRow key={transaction._id}>
                              <TableCell>{format(new Date(transaction.createdAt), "PPP")}</TableCell>
                              <TableCell className="capitalize">{transaction.type}</TableCell>
                              <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount} Taka
                              </TableCell>
                              <TableCell>{transaction.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No transactions found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tournaments" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tournament Participation</CardTitle>
                    <CardDescription>Tournaments this user has joined</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userDetails.tournaments.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tournament</TableHead>
                            <TableHead>Player Details</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails.tournaments.map((registration) => (
                            <TableRow key={registration._id}>
                              <TableCell>
                                <div className="font-medium">{registration.tournament.title}</div>
                                <div className="text-sm text-muted-foreground">{registration.tournament.game}</div>
                              </TableCell>
                              <TableCell>
                                <div>{registration.playerName}</div>
                                <div className="text-sm font-mono">{registration.playerID}</div>
                              </TableCell>
                              <TableCell>{format(new Date(registration.registrationDate), "PPP")}</TableCell>
                              <TableCell>
                                {registration.tournament.isCompleted ? (
                                  <Badge>Completed</Badge>
                                ) : registration.tournament.isActive ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                    Inactive
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No tournament registrations found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prizes" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Prize History</CardTitle>
                    <CardDescription>Prizes won by this user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userDetails.prizes.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Tournament</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails.prizes.map((prize) => (
                            <TableRow key={prize._id}>
                              <TableCell>{format(new Date(prize.createdAt), "PPP")}</TableCell>
                              <TableCell>{prize.tournamentCode}</TableCell>
                              <TableCell>{prize.amount} Taka</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    prize.status === "completed"
                                      ? "default"
                                      : prize.status === "rejected"
                                        ? "destructive"
                                        : "outline"
                                  }
                                >
                                  {prize.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No prizes found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topups" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top-up History</CardTitle>
                    <CardDescription>Account top-ups by this user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userDetails.topUps.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails.topUps.map((topUp) => (
                            <TableRow key={topUp._id}>
                              <TableCell>{format(new Date(topUp.createdAt), "PPP")}</TableCell>
                              <TableCell>{topUp.amount} Taka</TableCell>
                              <TableCell className="capitalize">{topUp.paymentMethod}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    topUp.status === "completed"
                                      ? "default"
                                      : topUp.status === "rejected"
                                        ? "destructive"
                                        : "outline"
                                  }
                                >
                                  {topUp.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No top-ups found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Failed to load user details</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
