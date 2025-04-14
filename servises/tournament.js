export async function getTournaments(token) {
    try {
        // fetch tournaments from api
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        if (!response.ok) {
            throw new Error("Failed to fetch tournaments")
        }
        const tournaments = await response.json()
        return tournaments
    } catch (error) {
        console.error("Failed to fetch tournaments:", error)
    }
}

export async function getTournamentById(id, token) {
    try {
        // fetch tournament by id from api
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        if (!response.ok) {
            throw new Error("Failed to fetch tournament")
        }
        const tournament = await response.json()
        return tournament
    } catch (error) {
        console.error(`Failed to fetch tournament with id ${id}:`, error)
    }
}

export async function addTournament(tournamentData, token) {
    try {
        // fetch tournaments from api
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tournamentData),
        })
        if (!response.ok) {
            throw new Error("Failed to add tournament")
        }
        const tournament = await response.json()
        revalidatePath("/")
        return tournament
    } catch (error) {
        console.error("Failed to add tournament:", error)
    }
}

export async function updateTournament(id, tournamentData, token) {
    try {
        // fetch tournaments from api
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tournamentData),
        })
        if (!response.ok) {
            throw new Error("Failed to update tournament")
        }
        const tournament = await response.json()
        revalidatePath("/")
        revalidatePath(`/tournaments/${id}`)
        return tournament
    } catch (error) {
        console.error(`Failed to update tournament with id ${id}:`, error)
    }
}

export async function updateTournamentStatus(id, isActive, isCompleted, token) {
    try {
        // fetch tournaments from api
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive, isCompleted }),
        })
        if (!response.ok) {
            throw new Error("Failed to update tournament status")
        }
        const tournament = await response.json()
        revalidatePath("/")
        revalidatePath(`/tournaments/${id}`)
        return tournament
    } catch (error) {
        console.error(`Failed to update tournament status with id ${id}:`, error)
    }
}
