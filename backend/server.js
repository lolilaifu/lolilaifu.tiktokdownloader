const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// TikTok download endpoint
app.post('/api/download', async (req, res) => {
    try {
        const { url } = req.body;
        
        // Validate TikTok URL
        if (!isValidTikTokUrl(url)) {
            return res.status(400).json({ error: 'Invalid TikTok URL' });
        }

        // Fetch video data from Snaptik API
        const videoData = await fetchVideoData(url);
        
        res.json(videoData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process video' });
    }
});

// Helper functions
function isValidTikTokUrl(url) {
    const tiktokRegex = /https?:\/\/((www\.)?tiktok\.com\/@.+\/video\/\d+|vt\.tiktok\.com\/\w+)/i;
    return tiktokRegex.test(url);
}

async function fetchVideoData(url) {
    // Implement actual API integration here
    // This is a placeholder implementation
    return {
        thumbnail: 'https://via.placeholder.com/480x270',
        videoUrl: url,
        resolutions: [
            { quality: '720p', url: url },
            { quality: '1080p', url: url }
        ]
    };
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});