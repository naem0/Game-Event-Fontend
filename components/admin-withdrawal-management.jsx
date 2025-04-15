"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Search, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

export function AdminWithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [processingAction, setProcessingAction] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchWithdrawals()
    }
  }, [session, pagination.page, statusFilter, searchQuery])

  const fetchWithdrawals = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/withdraw/admin?page=${pagination.page}&limit=${pagination.limit}`

      if (statusFilter && statusFilter !== "all") {
        url += `&status=${statusFilter}`
      }

      if (searchQuery) {
        url += `&search=${searchQuery}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch withdrawal requests")
      }

      const data = await response.json()
      setWithdrawals(data.withdrawals)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load withdrawal requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage })
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Reset to first page when searching
    setPagination({ ...pagination, page: 1 })
  }

  const openApproveDialog = (withdrawal) => {
    setSelectedWithdrawal(withdrawal)
    setNotes("")
    setApproveDialogOpen(true)
  }

  const openRejectDialog = (withdrawal) => {
    setSelectedWithdrawal(withdrawal)
    setNotes("")
    setRejectDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedWithdrawal) return

    setProcessingAction(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/withdraw/${selectedWithdrawal._id}/process`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          body: JSON.stringify({ status: "completed", notes }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to approve withdrawal request")
      }

      toast({
        title: "Success",
        description: "Withdrawal request approved successfully",
      })

      // Update the local state
      setWithdrawals(withdrawals.filter((w) => w._id !== selectedWithdrawal._id))

      // Close the dialog
      setApproveDialogOpen(false)
      setSelectedWithdrawal(null)

      // Refresh the data if needed
      if (statusFilter !== "pending") {
        fetchWithdrawals()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve withdrawal request",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const handleReject = async () => {
    if (!selectedWithdrawal) return

    setProcessingAction(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/withdraw/${selectedWithdrawal._id}/process`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          body: JSON.stringify({ status: "rejected", notes }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to reject withdrawal request")
      }

      toast({
        title: "Success",
        description: "Withdrawal request rejected successfully",
      })

      // Update the local state
      setWithdrawals(withdrawals.filter((w) => w._id !== selectedWithdrawal._id))

      // Close the dialog
      setRejectDialogOpen(false)
      setSelectedWithdrawal(null)

      // Refresh the data if needed
      if (statusFilter !== "pending") {
        fetchWithdrawals()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject withdrawal request",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div>Loading withdrawal requests...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Withdrawal Requests</CardTitle>
        <CardDescription>Review and process user withdrawal requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search by account number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {withdrawals.length > 0 ? (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal._id}>
                        <TableCell>{format(new Date(withdrawal.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>{withdrawal.user.name}</TableCell>
                        <TableCell>{withdrawal.amount} Taka</TableCell>
                        <TableCell className="capitalize">{withdrawal.paymentMethod}</TableCell>
                        <TableCell className="font-mono text-xs">{withdrawal.accountNumber}</TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                        <TableCell>
                          {withdrawal.status === "pending" && (
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600"
                                onClick={() => openApproveDialog(withdrawal)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
                                onClick={() => openRejectDialog(withdrawal)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {withdrawals.length} of {pagination.total} results
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No withdrawal requests found</p>
              {statusFilter || searchQuery ? (
                <p className="text-sm text-muted-foreground mt-2">Try changing your filters or search query</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No pending withdrawal requests to process</p>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Withdrawal Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this withdrawal request for {selectedWithdrawal?.amount} Taka?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedWithdrawal?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">{selectedWithdrawal?.amount} Taka</p>
              </div>
              <div>
                <p className="text-sm font-medium">Method</p>
                <p className="text-sm capitalize">{selectedWithdrawal?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Account</p>
                <p className="text-sm font-mono">{selectedWithdrawal?.accountNumber}</p>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this approval"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={processingAction}>
              {processingAction ? "Processing..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this withdrawal request? The amount will be refunded to the user's
              balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedWithdrawal?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">{selectedWithdrawal?.amount} Taka</p>
              </div>
              <div>
                <p className="text-sm font-medium">Method</p>
                <p className="text-sm capitalize">{selectedWithdrawal?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Account</p>
                <p className="text-sm font-mono">{selectedWithdrawal?.accountNumber}</p>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Reason for Rejection
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide a reason for rejecting this request"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processingAction}>
              {processingAction ? "Processing..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
