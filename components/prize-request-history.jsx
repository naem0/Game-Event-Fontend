"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Search, FileText } from "lucide-react"
import { format } from "date-fns"

export function PrizeRequestHistory() {
  const [prizeRequests, setPrizeRequests] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchPrizeRequests()
    }
  }, [session, pagination.page, statusFilter, searchQuery])

  const fetchPrizeRequests = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes?page=${pagination.page}&limit=${pagination.limit}`

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
        <CardTitle>Prize Request History</CardTitle>
        <CardDescription>View your prize money requests and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search by tournament code"
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
                      <TableHead>Tournament</TableHead>
                      <TableHead>Prize Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prizeRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>{format(new Date(request.createdAt), "MMM d, yyyy")}</TableCell>
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
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/dashboard/prizes/${request._id}`} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4" />
                            </a>
                          </Button>
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
                <p className="text-sm text-muted-foreground mt-2">Submit a prize request to see it here</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
