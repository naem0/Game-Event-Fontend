

export const getMatchDetails = async (id) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournament/${id}`,
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Something went wrong fetching tournament details data");
        console.info(error);
    }
};
