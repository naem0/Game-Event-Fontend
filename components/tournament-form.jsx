"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { addTournament, updateTournament } from "@/servises/tournament"

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  device: z.string().min(1, { message: "Device is required" }),
  tournamentCode: z.string().min(1, { message: "Tournament code is required" }),
  logo: z.string().url({ message: "Must be a valid URL" }),
  coverImage: z.string().url({ message: "Must be a valid URL" }),
  game: z.string().min(1, { message: "Game is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.string().min(1, { message: "Type is required" }),
  version: z.string().min(1, { message: "Version is required" }),
  map: z.string().min(1, { message: "Map is required" }),
  matchType: z.string().min(1, { message: "Match type is required" }),
  entryFee: z.coerce.number().min(0, { message: "Entry fee must be a positive number" }),
  matchSchedule: z.date({ required_error: "Match schedule is required" }),
  winningPrize: z.coerce.number().min(0, { message: "Winning prize must be a positive number" }),
  perKillPrize: z.coerce.number().min(0, { message: "Per kill prize must be a positive number" }),
  rules: z.string().min(10, { message: "Rules must be at least 10 characters" }),
  maxPlayers: z.coerce.number().min(1, { message: "Max players must be at least 1" }),
  playersRegistered: z.coerce.number().min(0, { message: "Players registered must be a positive number" }),
  isActive: z.boolean().default(true),
  isCompleted: z.boolean().default(false),
})

export default function TournamentForm({ tournament = null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  // user session from useSession
  const { data: session } = useSession()
  const token = session?.user?.apiToken;


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: tournament
      ? {
          ...tournament,
          matchSchedule: new Date(tournament.matchSchedule),
        }
      : {
          title: "",
          device: "",
          tournamentCode: "",
          logo: "",
          coverImage: "",
          game: "",
          description: "",
          type: "",
          version: "",
          map: "",
          matchType: "",
          entryFee: 0,
          matchSchedule: undefined,
          winningPrize: 0,
          perKillPrize: 0,
          rules: "",
          maxPlayers: 100,
          playersRegistered: 0,
          isActive: true,
          isCompleted: false,
        },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      if (tournament) {
        await updateTournament(tournament._id, values, token)
      } else {
        await addTournament(values, token)
      }
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Solo Time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tournamentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Code</FormLabel>
                  <FormControl>
                    <Input placeholder="37538" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="game"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select game" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Free Fire">Free Fire</SelectItem>
                      <SelectItem value="PUBG Mobile">PUBG Mobile</SelectItem>
                      <SelectItem value="Call of Duty Mobile">Call of Duty Mobile</SelectItem>
                      <SelectItem value="Clash Royale">Clash Royale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="Console">Console</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Solo">Solo</SelectItem>
                      <SelectItem value="Duo">Duo</SelectItem>
                      <SelectItem value="Squad">Squad</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TPP">TPP</SelectItem>
                      <SelectItem value="FPP">FPP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="map"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select map" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bermuda">Bermuda</SelectItem>
                      <SelectItem value="Kalahari">Kalahari</SelectItem>
                      <SelectItem value="Purgatory">Purgatory</SelectItem>
                      <SelectItem value="Alpine">Alpine</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matchType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Match Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select match type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/cover.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entryFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Fee (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="winningPrize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Winning Prize (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="perKillPrize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Per Kill Prize (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Players</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="playersRegistered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Players Registered</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matchSchedule"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Match Schedule</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP p") : <span>Pick a date and time</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      <div className="p-3 border-t">
                        <Input
                          type="time"
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":").map(Number)
                            const newDate = new Date(field.value || new Date())
                            newDate.setHours(hours, minutes)
                            field.onChange(newDate)
                          }}
                          defaultValue={
                            field.value
                              ? `${field.value.getHours().toString().padStart(2, "0")}:${field.value.getMinutes().toString().padStart(2, "0")}`
                              : ""
                          }
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Join our exciting solo tournament!" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rules</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter tournament rules and instructions..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-6">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full sm:w-1/2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>Tournament will be visible to players</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full sm:w-1/2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Completion Status</FormLabel>
                    <FormDescription>Mark tournament as completed</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : tournament ? "Update Tournament" : "Create Tournament"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
