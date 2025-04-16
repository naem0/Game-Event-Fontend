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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Search, CheckCircle, XCircle, Eye } from "lucide-react"
import { format } from "date-fns"

export function AdminPrizeManagement() {
  const [prizeRequests, setPrizeRequests] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [notes, setNotes] = useState("")
  const [processingAction, setProcessingAction] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchPrizeRequests()
    }
  }, [session, pagination.page, statusFilter, searchQuery])

  const fetchPrizeRequests = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/admin?page=${pagination.page}&limit=${pagination.limit}`

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
        throw new Error("Failed to fetch prize requests")
      }

      const data = await response.json()
      setPrizeRequests(data.prizeRequests)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load prize requests",
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

  const openApproveDialog = (request) => {
    setSelectedRequest(request)
    setAmount(request.amount.toString())
    setAccountNumber(request.accountNumber)
    setPaymentMethod(request.paymentMethod)
    setNotes("")
    setApproveDialogOpen(true)
  }

  const openRejectDialog = (request) => {
    setSelectedRequest(request)
    setNotes("")
    setRejectDialogOpen(true)
  }

  const openDetailsDialog = (request) => {
    setSelectedRequest(request)
    setDetailsDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    setProcessingAction(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${selectedRequest._id}/process`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.apiToken}`,
        },
        body: JSON.stringify({
          status: "approved",
          amount,
          accountNumber,
          paymentMethod,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve prize request")
      }

      toast({
        title: "Success",
        description: "Prize request approved successfully",
      })

      // Update the local state
      setPrizeRequests(prizeRequests.filter((p) => p._id !== selectedRequest._id))

      // Close the dialog
      setApproveDialogOpen(false)
      setSelectedRequest(null)

      // Refresh the data if needed
      if (statusFilter !== "pending") {
        fetchPrizeRequests()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve prize request",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    setProcessingAction(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${selectedRequest._id}/process`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.apiToken}`,
        },
        body: JSON.stringify({
          status: "rejected",
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject prize request")
      }

      toast({
        title: "Success",
        description: "Prize request rejected successfully",
      })

      // Update the local state
      setPrizeRequests(prizeRequests.filter((p) => p._id !== selectedRequest._id))

      // Close the dialog
      setRejectDialogOpen(false)
      setSelectedRequest(null)

      // Refresh the data if needed
      if (statusFilter !== "pending") {
        fetchPrizeRequests()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject prize request",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const getPrizeTypeBadge = (type) => {
    switch (type) {
      case "kill_prize":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Kill Prize
          </Badge>
        )
      case "winner_prize":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Winner Prize
          </Badge>
        )
      case "both":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
            Kill & Winner Prize
          </Badge>
        )
      case "other":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Other Prize
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
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
    return <div>Loading prize requests...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Prize Requests</CardTitle>
        <CardDescription>Review and process user prize money requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search by player name or ID"
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

          {prizeRequests.length > 0 ? (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Tournament</TableHead>
                      <TableHead>Prize Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prizeRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>{format(new Date(request.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>{request.user.name}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.tournament.title}</p>
                            <p className="text-xs text-muted-foreground">{request.tournament.game}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getPrizeTypeBadge(request.prizeType)}</TableCell>
                        <TableCell>{request.amount} Taka</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>

                            {request.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600"
                                  onClick={() => openApproveDialog(request)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => openRejectDialog(request)}
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
                  Showing {prizeRequests.length} of {pagination.total} results
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
              <p className="text-muted-foreground">No prize requests found</p>
              {statusFilter || searchQuery ? (
                <p className="text-sm text-muted-foreground mt-2">Try changing your filters or search query</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No pending prize requests to process</p>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Prize Request</DialogTitle>
            <DialogDescription>
              Review and approve this prize request. You can edit the payment details if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedRequest?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tournament</p>
                <p className="text-sm">{selectedRequest?.tournament.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prize Type</p>
                <p className="text-sm capitalize">{selectedRequest?.prizeType.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Player Details</p>
                <p className="text-sm">
                  {selectedRequest?.playerName} (ID: {selectedRequest?.playerID})
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Taka)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                <Label
                  htmlFor="bkash-approve"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    paymentMethod === "bkash" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="bkash" id="bkash-approve" className="sr-only" />
                  <img
                    src="/placeholder.svg?height=60&width=100&text=bKash"
                    alt="bKash"
                    className="h-10 object-contain"
                  />
                  <span className="mt-2 text-sm font-medium">bKash</span>
                </Label>
                <Label
                  htmlFor="nagad-approve"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    paymentMethod === "nagad" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="nagad" id="nagad-approve" className="sr-only" />
                  <img
                    src="/placeholder.svg?height=60&width=100&text=Nagad"
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
                required
              />
            </div>

            <div className="space-y-2">
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
            <DialogTitle>Reject Prize Request</DialogTitle>
            <DialogDescription>Are you sure you want to reject this prize request?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedRequest?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tournament</p>
                <p className="text-sm">{selectedRequest?.tournament.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prize Type</p>
                <p className="text-sm capitalize">{selectedRequest?.prizeType?.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">{selectedRequest?.amount} Taka</p>
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
            <DialogTitle>Prize Request Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-sm">{selectedRequest?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{selectedRequest?.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tournament</p>
                <p className="text-sm">{selectedRequest?.tournament.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tournament Code</p>
                <p className="text-sm">{selectedRequest?.tournamentCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prize Type</p>
                <p className="text-sm capitalize">{selectedRequest?.prizeType?.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">{selectedRequest?.amount} Taka</p>
              </div>
              <div>
                <p className="text-sm font-medium">Player Name</p>
                <p className="text-sm">{selectedRequest?.playerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Player ID</p>
                <p className="text-sm">{selectedRequest?.playerID}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm capitalize">{selectedRequest?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Account Number</p>
                <p className="text-sm">{selectedRequest?.accountNumber}</p>
              </div>
              {selectedRequest?.kills > 0 && (
                <div>
                  <p className="text-sm font-medium">Kills</p>
                  <p className="text-sm">{selectedRequest?.kills}</p>
                </div>
              )}
              {selectedRequest?.position > 0 && (
                <div>
                  <p className="text-sm font-medium">Position</p>
                  <p className="text-sm">{selectedRequest?.position}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm capitalize">{selectedRequest?.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">
                  {selectedRequest && format(new Date(selectedRequest.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              {selectedRequest?.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm">{selectedRequest.notes}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Proof Screenshot</p>
              {selectedRequest?.proofImage && (
                <div className="border rounded-md p-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedRequest.proofImage}`}
                    alt="Proof screenshot"
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
