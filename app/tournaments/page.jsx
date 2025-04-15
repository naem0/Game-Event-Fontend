"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TournamentCard } from "@/components/tournament-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

export default function TournamentsPage() {
  const searchParams = useSearchParams()
  const moodParam = searchParams.get("mood")

  const [tournaments, setTournaments] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12,
  })
  const [loading, setLoading] = useState(true)
  const [moodFilter, setMoodFilter] = useState(moodParam || "all")
  const [statusFilter, setStatusFilter] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [moods, setMoods] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchMoods()
  }, [])

  useEffect(() => {
    fetchTournaments()
  }, [pagination.page, moodFilter, statusFilter, searchQuery])

  const fetchMoods = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments/moods`)

      if (!response.ok) {
        throw new Error("Failed to fetch tournament moods")
      }

      const data = await response.json()
      setMoods(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tournament moods",
        variant: "destructive",
      })
    }
  }

  const fetchTournaments = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments?page=${pagination.page}&limit=${pagination.limit}`

      if (moodFilter && moodFilter !== "all") {
        url += `&mood=${moodFilter}`
      }

      if (statusFilter === "active") {
        url += "&isActive=true&isCompleted=false"
      } else if (statusFilter === "upcoming") {
        url += "&isActive=true&isCompleted=false"
      } else if (statusFilter === "completed") {
        url += "&isCompleted=true"
      }

      if (searchQuery) {
        url += `&search=${searchQuery}`
      }

      const response = await fetch(url)

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
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Reset to first page when searching
    setPagination({ ...pagination, page: 1 })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{moodFilter ? `${moodFilter} Tournaments` : "All Tournaments"}</h1>
        <p className="text-muted-foreground">Browse and join exciting gaming tournaments</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
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

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={moodFilter} onValueChange={setMoodFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              {moods.map((mood) => (
                <SelectItem key={mood} value={mood}>
                  {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading tournaments...</div>
      ) : tournaments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament._id} tournament={tournament} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current page
                    return page === 1 || page === pagination.pages || Math.abs(page - pagination.page) <= 1
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there are gaps
                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1
                    const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsisBefore && <span className="mx-2">...</span>}

                        <Button
                          variant={pagination.page === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>

                        {showEllipsisAfter && <span className="mx-2">...</span>}
                      </div>
                    )
                  })}

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
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tournaments found</p>
          {(moodFilter || statusFilter !== "active" || searchQuery) && (
            <p className="text-sm text-muted-foreground mt-2">Try changing your filters or search query</p>
          )}
        </div>
      )}
    </div>
  )
}
