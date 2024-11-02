'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

type Player = {
  id: number
  rank: number
  name: string
  points: number
  change?: string
  avatar: string
}

export default function Component() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/leaderboard')
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      const data = await response.json()
      setLeaderboard(data)
    } catch (err) {
      setError('Failed to load leaderboard. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePoints = async (id: number, points: number) => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, points }),
      })
      if (!response.ok) throw new Error('Failed to update points')
      const data = await response.json()
      setLeaderboard(data)
    } catch (err) {
      setError('Failed to update points. Please try again.')
    }
  }

  if (isLoading) {
    return <div className="w-full max-w-md mx-auto min-h-screen bg-gradient-to-b from-purple-900 to-indigo-950 p-4">
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  }

  if (error) {
    return <div className="w-full max-w-md mx-auto min-h-screen bg-gradient-to-b from-purple-900 to-indigo-950 p-4 text-white">
      <p>{error}</p>
      <Button onClick={fetchLeaderboard} className="mt-4">Retry</Button>
    </div>
  }

  const topThree = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3)

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-gradient-to-b from-purple-900 to-indigo-950">
      <header className="flex items-center justify-between p-4 text-white">
        <Button variant="ghost" size="icon" className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">LEADERBOARD</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-emerald-400">
              Monthly <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Daily</DropdownMenuItem>
            <DropdownMenuItem>Weekly</DropdownMenuItem>
            <DropdownMenuItem>Monthly</DropdownMenuItem>
            <DropdownMenuItem>All Time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="relative pt-20 pb-10">
        <div className="flex justify-center items-end gap-4 mb-8">
          {topThree.map((player, index) => (
            <div key={player.id} className={`text-center ${index === 1 ? '' : 'mb-4'}`}>
              {index === 0 && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <span className="text-yellow-400 text-2xl">👑</span>
                </div>
              )}
              <Avatar className={`${index === 0 ? 'w-20 h-20' : 'w-16 h-16'} border-2 ${
                index === 0 ? 'border-pink-400' : index === 1 ? 'border-cyan-400' : 'border-green-400'
              }`}>
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback>{player.name[0]}</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-white">
                <div className="text-sm">{player.name}</div>
                <div className="text-lg font-bold">{player.points}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-t-3xl">
          <ScrollArea className="h-[400px] px-4 pt-4">
            {restOfLeaderboard.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-4 py-3 border-b border-gray-100"
              >
                <span className="text-gray-500 w-6">{player.rank}</span>
                <Avatar>
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-gray-500">{player.points} pts</div>
                </div>
                <span
                  className={`text-sm ${
                    player.change?.startsWith("+")
                      ? "text-green-500"
                      : player.change?.startsWith("-")
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {player.change}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePoints(player.id, 10)}
                >
                  +10 pts
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
