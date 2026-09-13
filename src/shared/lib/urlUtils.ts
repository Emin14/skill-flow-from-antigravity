export const extractYoutubeTitle = async (url: string): Promise<string | null> => {
  if (!url) return null;
  
  // Regex to match YouTube video URLs (watch?v= or youtu.be/)
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(ytRegex);
  
  if (!match) return null; // Not a valid YouTube video URL

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);
    if (!response.ok) return null;
    const data = await response.json();
    return data.title || null;
  } catch (error) {
    console.error("Error fetching YouTube title:", error);
    return null;
  }
};
