"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Eye } from "lucide-react"
import { useSession } from "next-auth/react"
import { getTournaments, updateTournamentStatus } from "@/servises/tournament"

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const token = session?.user?.apiToken;

  useEffect(() => {
    if (token) {
      const fetchTournaments = async () => {
        try {
          const data = await getTournaments(token)
          setTournaments(data)
        } catch (error) {
          console.error("Failed to fetch tournaments:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchTournaments()
    }
  }, [token])

  const handleStatusChange = async (id, isActive) => {
    try {
      await updateTournamentStatus(id, isActive, token)
      setTournaments(
        tournaments.map((tournament) => (tournament._id === id ? { ...tournament, isActive } : tournament)),
      )
    } catch (error) {
      console.error("Failed to update tournament status:", error)
    }
  }

  const handleCompletionChange = async (id, isCompleted) => {
    try {
      await updateTournamentStatus(id, undefined, isCompleted, token)
      setTournaments(
        tournaments.map((tournament) => (tournament._id === id ? { ...tournament, isCompleted } : tournament)),
      )
    } catch (error) {
      console.error("Failed to update tournament completion status:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading tournaments...</div>
  }

  return (
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No tournaments found
              </TableCell>
            </TableRow>
          ) : (
            tournaments?.map((tournament) => (
              <TableRow key={tournament._id}>
                <TableCell className="font-medium">{tournament.title}</TableCell>
                <TableCell>{tournament.game}</TableCell>
                <TableCell>{tournament.type}</TableCell>
                <TableCell>{tournament.matchSchedule}</TableCell>
                <TableCell>₹{tournament.entryFee}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={tournament.isActive ? "default" : "outline"}>
                      {tournament.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={tournament.isCompleted ? "destructive" : "outline"}>
                      {tournament.isCompleted ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`deshboard/admin/tournaments/${tournament._id}`}>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`deshboard/admin/tournaments/edit/${tournament._id}`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit tournament
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => handleStatusChange(tournament._id, !tournament.isActive)}>
                        {tournament.isActive ? "Deactivate" : "Activate"} tournament
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCompletionChange(tournament._id, !tournament.isCompleted)}>
                        Mark as {tournament.isCompleted ? "pending" : "completed"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
