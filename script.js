document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('tiktokUrl').value;
    const status = document.getElementById('status');
    
    status.textContent = 'Processing...';
    
    try {
        // Fetch video data
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to fetch video data');
        
        const data = await response.json();
        const videoUrl = data.html.match(/src="([^"]+)"/)[1];
        
        // Create download link
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'tiktok_video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        status.textContent = 'Download complete!';
    } catch (error) {
        status.textContent = 'Error: ' + error.message;
        console.error(error);
    }
});