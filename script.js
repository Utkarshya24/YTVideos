// Constants
const API_URL = 'https://api.freeapi.app/api/v1/public/youtube/videos';
const DOM = {
    videoGrid: document.getElementById('videoGrid'),
    searchInput: document.getElementById('searchInput')
};

// State
let allVideos = [];

// API Functions
const fetchVideos = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': window.location.origin
            },
            mode: 'cors',
            credentials: 'omit'
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const { success, data, message } = await response.json();
        
        if (success) {
            allVideos = data.data.map(({ items }) => ({
                videoId: items.id,
                title: items.snippet.title,
                channelName: items.snippet.channelTitle,
                thumbnail: items.snippet.thumbnails.high.url,
                description: items.snippet.description,
                publishedAt: items.snippet.publishedAt
            }));
            
            displayVideos(allVideos);
        } else {
            throw new Error(message);
        }
    } catch (error) {
        console.error('Error:', error);
        DOM.videoGrid.innerHTML = `
            <div class="error-message">
                Error loading videos. Please try one of these solutions:
            </div>`;
    }
};

// UI Functions
const createVideoCard = ({ videoId, title, thumbnail, channelName }) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <img class="thumbnail" src="${thumbnail}" alt="${title}">
        <div class="video-info">
            <h3 class="video-title">${title}</h3>
            <p class="channel-name">${channelName}</p>
        </div>
    `;
    
    card.addEventListener('click', () => 
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
    );
    
    return card;
};

const displayVideos = (videos) => {
    if (!Array.isArray(videos) || !videos.length) {
        DOM.videoGrid.innerHTML = '<div class="error-message">No videos found</div>';
        return;
    }
    
    DOM.videoGrid.innerHTML = '';
    videos.forEach(video => DOM.videoGrid.appendChild(createVideoCard(video)));
};

const searchVideos = (query) => {
    const searchTerm = query.toLowerCase();
    const filteredVideos = allVideos.filter(({ title, channelName }) => 
        title.toLowerCase().includes(searchTerm) || 
        channelName.toLowerCase().includes(searchTerm)
    );
    displayVideos(filteredVideos);
};

// Event Listeners
DOM.searchInput.addEventListener('input', (e) => searchVideos(e.target.value));

// Initialize
fetchVideos(); 