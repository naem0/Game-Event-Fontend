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
import { useToast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Eye,
  Users,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export function AdminTournamentList() {
  const [tournaments, setTournaments] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.apiToken) {
      fetchTournaments()
    }
  }, [session, pagination.page, statusFilter, searchQuery])

  const fetchTournaments = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments?page=${pagination.page}&limit=${pagination.limit}`

      if (statusFilter === "active") {
        url += "&isActive=true"
      } else if (statusFilter === "inactive") {
        url += "&isActive=false"
      } else if (statusFilter === "completed") {
        url += "&isCompleted=true"
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
        throw new Error("Failed to fetch tournaments")
      }

      const data = await response.json()
      setTournaments(data.tournaments)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tournaments",
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

  const openStatusDialog = (tournament) => {
    setSelectedTournament(tournament)
    setStatusDialogOpen(true)
  }

  const handleStatusChange = async (isActive, isCompleted) => {
    if (!selectedTournament) return

    setProcessingAction(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/${selectedTournament._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          body: JSON.stringify({ isActive, isCompleted }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update tournament status")
      }

      toast({
        title: "Success",
        description: "Tournament status updated successfully",
      })

      // Update the local state
      setTournaments(tournaments.map((t) => (t._id === selectedTournament._id ? { ...t, isActive, isCompleted } : t)))

      // Close the dialog
      setStatusDialogOpen(false)
      setSelectedTournament(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update tournament status",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const getStatusBadge = (tournament) => {
    if (tournament.isCompleted) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          Completed
        </Badge>
      )
    } else if (tournament.isActive) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Active
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Inactive
        </Badge>
      )
    }
  }

  if (loading) {
    return <div>Loading tournaments...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Management</CardTitle>
        <CardDescription>Manage all tournaments in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search tournaments"
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
                <SelectItem value="all">All Tournaments</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tournaments.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Game</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Entry Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournaments.map((tournament) => (
                      <TableRow key={tournament._id}>
                        <TableCell className="font-medium">{tournament.title}</TableCell>
                        <TableCell>{tournament.game}</TableCell>
                        <TableCell>{tournament.type}</TableCell>
                        <TableCell>{format(new Date(tournament.matchSchedule), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell>{tournament.entryFee} Taka</TableCell>
                        <TableCell>{getStatusBadge(tournament)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/admin/tournaments/${tournament._id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/tournaments/${tournament._id}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/admin/tournaments/${tournament._id}/registrations`}>
                                <Users className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openStatusDialog(tournament)}>
                              {tournament.isActive ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-red-600" />
                              )}
                            </Button>
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
                  Showing {tournaments.length} of {pagination.total} results
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
              <p className="text-muted-foreground">No tournaments found</p>
              {statusFilter || searchQuery ? (
                <p className="text-sm text-muted-foreground mt-2">Try changing your filters or search query</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Create your first tournament to get started</p>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Tournament Status</DialogTitle>
            <DialogDescription>Update the status of {selectedTournament?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleStatusChange(true, false)}
                disabled={processingAction || (selectedTournament?.isActive && !selectedTournament?.isCompleted)}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                <span>Set as Active</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleStatusChange(false, false)}
                disabled={processingAction || (!selectedTournament?.isActive && !selectedTournament?.isCompleted)}
              >
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                <span>Set as Inactive</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleStatusChange(false, true)}
                disabled={processingAction || selectedTournament?.isCompleted}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                <span>Mark as Completed</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
