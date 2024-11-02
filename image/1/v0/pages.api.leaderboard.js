import { NextResponse } from 'next/server'

let leaderboardData = [
  { id: 1, rank: 1, name: "Ronald", points: 10000, avatar: "/placeholder.svg?height=80&width=80" },
  { id: 2, rank: 2, name: "Norris", points: 139, avatar: "/placeholder.svg?height=64&width=64" },
  { id: 3, rank: 3, name: "Tony", points: 127, avatar: "/placeholder.svg?height=64&width=64" },
  { id: 4, rank: 4, name: "Bhavna Mepani", points: 91, change: "+2", avatar: "/placeholder.svg?height=48&width=48" },
  { id: 5, rank: 5, name: "Robin", points: 83, change: "+1", avatar: "/placeholder.svg?height=49&width=49" },
  { id: 6, rank: 6, name: "Taran", points: 79, change: "-2", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 7, rank: 7, name: "Mike", points: 69, change: "+3", avatar: "/placeholder.svg?height=51&width=51" },
  { id: 8, rank: 8, name: "Andrew", points: 61, change: "+1", avatar: "/placeholder.svg?height=52&width=52" },
]

export async function GET() {
  return NextResponse.json(leaderboardData)
}

export async function POST(request) {
  const { id, points } = await request.json()
  const playerIndex = leaderboardData.findIndex(player => player.id === id)
  
  if (playerIndex === -1) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  leaderboardData[playerIndex].points += points

  // Re-sort and update ranks
  leaderboardData.sort((a, b) => b.points - a.points)
  leaderboardData.forEach((player, index) => {
    player.rank = index + 1
    player.change = player.rank < playerIndex + 1 ? '+1' : player.rank > playerIndex + 1 ? '-1' : '0'
  })

  return NextResponse.json(leaderboardData)
}
