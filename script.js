// DOM Elements
const videoUrlInput = document.getElementById('video-url');
const downloadBtn = document.getElementById('download-btn');
const videoPreview = document.getElementById('video-preview');
const downloadOptions = document.getElementById('download-options');

// Event Listeners
downloadBtn.addEventListener('click', handleDownload);

async function handleDownload() {
    const url = videoUrlInput.value.trim();
    
    if (!isValidTikTokUrl(url)) {
        showError('Please enter a valid TikTok URL');
        return;
    }

    try {
        // Show loading state
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Processing...';
        
        // Fetch video data
        const videoData = await fetchVideoData(url);
        
        // Display video preview
        displayVideoPreview(videoData);
        
        // Show download options
        displayDownloadOptions(videoData);
    } catch (error) {
        showError('Failed to process video. Please try again.');
        console.error(error);
    } finally {
        // Reset button state
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download';
    }
}

function isValidTikTokUrl(url) {
    const tiktokRegex = /https?:\/\/((www\.)?tiktok\.com\/@.+\/video\/\d+|vt\.tiktok\.com\/\w+)/i;
    return tiktokRegex.test(url);
}

async function fetchVideoData(url) {
    const response = await fetch('http://localhost:3001/api/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch video data');
    }

    return await response.json();
}

function displayVideoPreview(data) {
    videoPreview.innerHTML = `
        <div class="video-wrapper">
            <img src="${data.thumbnail}" alt="Video thumbnail">
            <div class="play-icon">&#9658;</div>
        </div>
    `;
}

function displayDownloadOptions(data) {
    const optionsHTML = data.resolutions.map(resolution => `
        <div class="download-option" onclick="downloadVideo('${resolution.url}')">
            <span>${resolution.quality}</span>
        </div>
    `).join('');

    downloadOptions.innerHTML = optionsHTML;
}

function downloadVideo(url) {
    // Create temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tiktok_video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Insert error message above the input
    videoUrlInput.parentNode.insertBefore(errorElement, videoUrlInput);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}