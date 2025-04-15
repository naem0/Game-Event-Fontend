"use client"

import { Label } from "@/components/ui/label"

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
import { ChevronLeft, ChevronRight, Search, CheckCircle, XCircle, Eye } from "lucide-react"
import { format } from "date-fns"

export function AdminTopUpManagement() {
  const [topUps, setTopUps] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopUp, setSelectedTopUp] = useState(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [processingAction, setProcessingAction] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchTopUps()
    }
  }, [session, pagination.page, statusFilter, searchQuery])

  const fetchTopUps = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topup/admin?page=${pagination.page}&limit=${pagination.limit}`

      if (statusFilter) {
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
        throw new Error("Failed to fetch top-up requests")
      }

      const data = await response.json()
      setTopUps(data.topUps)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load top-up requests",
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

  const openApproveDialog = (topUp) => {
    setSelectedTopUp(topUp)
    setNotes("")
    setApproveDialogOpen(true)
  }

  const openRejectDialog = (topUp) => {
    setSelectedTopUp(topUp)
    setNotes("")
    setRejectDialogOpen(true)
  }

  const openDetailsDialog = (topUp) => {
    setSelectedTopUp(topUp)
    setDetailsDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedTopUp) return

    setProcessingAction(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topup/${selectedTopUp._id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.apiToken}`,
        },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve top-up request")
      }

      toast({
        title: "Success",
        description: "Top-up request approved successfully",
      })

      // Update the local state
      setTopUps(topUps.filter((topUp) => topUp._id !== selectedTopUp._id))

      // Close the dialog
      setApproveDialogOpen(false)
      setSelectedTopUp(null)

      // Refresh the data if needed
      if (statusFilter !== "pending") {
        fetchTopUps()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve top-up request",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const handleReject = async () => {
    if (!selectedTopUp) return

    setProcessingAction(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topup/${selectedTopUp._id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.apiToken}`,
        },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject top-up request")
      }

      toast({
        title: "Success",
        description: "Top-up request rejected successfully",
      })

      // Update the local state
      setTopUps(topUps.filter((topUp) => topUp._id !== selectedTopUp._id))

      // Close the dialog
      setRejectDialogOpen(false)
      setSelectedTopUp(null)

      // Refresh the data if needed
      if (statusFilter !== "pending") {
        fetchTopUps()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject top-up request",
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
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
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
    return <div>Loading top-up requests...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Top-up Requests</CardTitle>
        <CardDescription>Review and process user balance top-up requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search by transaction ID"
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {topUps.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topUps.map((topUp) => (
                      <TableRow key={topUp._id}>
                        <TableCell>{format(new Date(topUp.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>{topUp.user.name}</TableCell>
                        <TableCell>{topUp.amount} Taka</TableCell>
                        <TableCell className="font-mono text-xs">{topUp.transactionId}</TableCell>
                        <TableCell>{getStatusBadge(topUp.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(topUp)}>
                              <Eye className="h-4 w-4" />
                            </Button>

                            {topUp.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600"
                                  onClick={() => openApproveDialog(topUp)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => openRejectDialog(topUp)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {topUps.length} of {pagination.total} results
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
              <p className="text-muted-foreground">No top-up requests found</p>
              {statusFilter || searchQuery ? (
                <p className="text-sm text-muted-foreground mt-2">Try changing your filters or search query</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No pending top-up requests to process</p>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Top-up Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this top-up request? This will add {selectedTopUp?.amount} Taka to the
              user's balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedTopUp?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">{selectedTopUp?.amount} Taka</p>
              </div>
              <div>
                <p className="text-sm font-medium">Transaction ID</p>
                <p className="text-sm font-mono">{selectedTopUp?.transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{selectedTopUp && format(new Date(selectedTopUp.createdAt), "MMM d, yyyy")}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
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
            <DialogTitle>Reject Top-up Request</DialogTitle>
            <DialogDescription>Are you sure you want to reject this top-up request?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedTopUp?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">{selectedTopUp?.amount} Taka</p>
              </div>
              <div>
                <p className="text-sm font-medium">Transaction ID</p>
                <p className="text-sm font-mono">{selectedTopUp?.transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{selectedTopUp && format(new Date(selectedTopUp.createdAt), "MMM d, yyyy")}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Reason for Rejection</Label>
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

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Top-up Request Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedTopUp?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{selectedTopUp?.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">{selectedTopUp?.amount} Taka</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm">{selectedTopUp?.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Transaction ID</p>
                <p className="text-sm font-mono">{selectedTopUp?.transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{selectedTopUp && format(new Date(selectedTopUp.createdAt), "MMM d, yyyy")}</p>
              </div>
              {selectedTopUp?.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm">{selectedTopUp.notes}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Payment Slip</p>
              {selectedTopUp?.slipImage && (
                <div className="border rounded-md p-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedTopUp.slipImage}`}
                    alt="Payment slip"
                    className="max-h-96 mx-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
