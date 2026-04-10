const videoData = [
    { url: 'https://assets.mixkit.co/videos/preview/mixkit-skateboarding-under-a-bridge-4451-large.mp4', user: '@skater_pro', desc: 'Landing this took 40 tries. #skate', likes: '12k' },
    { url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-top-view-938-large.mp4', user: '@nature_ocean', desc: '7 seconds of pure peace. #zen', likes: '5k' },
    { url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-under-neon-lights-41221-large.mp4', user: '@neon_dancer', desc: 'Night vibes only. 🕺', likes: '88k' },
    { url: 'https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4', user: '@light_show', desc: 'Glitch in the matrix.', likes: '2k' }
];

const feed = document.getElementById('video-feed');

function loadVideos(dataArray) {
    feed.innerHTML = ''; // Clear feed
    dataArray.forEach(data => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <video src="${data.url}" loop playsinline></video>
            
            <div class="sidebar">
                <div class="action-item"><div class="icon-circle">❤️</div><span>${data.likes}</span></div>
                <div class="action-item"><div class="icon-circle">💬</div><span>42</span></div>
                <div class="action-item"><div class="icon-circle">🔗</div><span>Share</span></div>
            </div>

            <div class="video-info">
                <h3>${data.user}</h3>
                <p>${data.desc}</p>
            </div>
        `;
        feed.appendChild(card);
    });
    
    // Re-attach observer to new cards
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => observer.observe(card));
}

// Search Functionality
function filterVideos() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = videoData.filter(v => v.user.toLowerCase().includes(term));
    loadVideos(filtered);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
            video.play().catch(e => console.log("Waiting for user interaction"));
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
}, { threshold: 0.6 });

function startApp() {
    document.getElementById('start-overlay').style.display = 'none';
    const videos = document.querySelectorAll('video');
    // Muted is false because user clicked a button to enter
    videos.forEach(v => v.muted = false); 
}

// Initial Load
loadVideos(videoData);
