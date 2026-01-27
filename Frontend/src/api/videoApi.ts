export interface Video {
    _id: string;
    url: string;
    title: string;
    public_id: string;
}

export const fetchVideos = async (): Promise<Video[]> => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/videos');
        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        return data.data; // Assuming ApiResponse structure puts data in `data`
    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
};
