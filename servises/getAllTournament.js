

export const getAllTournament = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments`,
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Something went wrong fetching tournament data");
        console.info(error);
    }
};
