// 1. DATABASE OF VIDEOS
const videoData = [
    { 
        url: 'https://archive.org/download/vine-iminmemumscar/vine-iminmemumscar.mp4', 
        user: '@iminmemumscar', 
        desc: 'Broom broom! #classic #vine', 
        likes: '99k' 
    },
    { 
        url: 'https://assets.mixkit.co/videos/preview/mixkit-skateboarding-under-a-bridge-4451-large.mp4', 
        user: '@skater_pro', 
        desc: 'Landing this took 40 tries. #skate', 
        likes: '12k' 
    },
    { 
        url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-under-neon-lights-41221-large.mp4', 
        user: '@neon_dancer', 
        desc: 'Night vibes only. 🕺', 
        likes: '88k' 
    }
];

const feed = document.getElementById('video-feed');

// 2. GENERATE THE FEED
function loadVideos(dataArray) {
    feed.innerHTML = ''; 
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

        // PLAY/PAUSE ON CLICK LOGIC
        const videoElement = card.querySelector('video');
        videoElement.addEventListener('click', () => {
            if (videoElement.paused) {
                videoElement.play();
                videoElement.style.opacity = "1";
            } else {
                videoElement.pause();
                videoElement.style.opacity = "0.7"; // Dim when paused
            }
        });

        feed.appendChild(card);
    });
    
    // Observer starts playing videos when they scroll into view
    const allCards = document.querySelectorAll('.video-card');
    allCards.forEach(card => observer.observe(card));
}

// 3. AUTO-PLAY CONTROLLER
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
            video.play().catch(() => {}); // Play when visible
            video.style.opacity = "1";
        } else {
            video.pause();
            video.currentTime = 0; // Reset to start when scrolled away
        }
    });
}, { threshold: 0.7 });

// 4. SEARCH LOGIC
function filterVideos() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = videoData.filter(v => 
        v.user.toLowerCase().includes(term) || 
        v.desc.toLowerCase().includes(term)
    );
    loadVideos(filtered);
}

// 5. START BUTTON
function startApp() {
    document.getElementById('start-overlay').style.display = 'none';
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => v.muted = false); // Unmute everything once user interacts
}

// INITIALIZE
loadVideos(videoData);
