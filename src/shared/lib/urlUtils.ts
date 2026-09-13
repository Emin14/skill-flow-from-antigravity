export const extractLinkTitle = async (url: string): Promise<string | null> => {
  if (!url) return null;
  
  // 1. Fast path for YouTube using oEmbed API
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  if (ytRegex.test(url)) {
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.title) return data.title;
      }
    } catch (error) {
      console.error("Error fetching YouTube title:", error);
    }
  }

  // 2. Generic link parsing via backend API route
  try {
    const apiUrl = `/api/link-preview?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return data.title || null;
    }
  } catch (error) {
    console.error("Error fetching generic link title:", error);
  }

  return null;
};
