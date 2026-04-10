// 1. Add your video links here! 
// For now, these are high-quality placeholder loops.
const videoData = [
    { url: 'https://assets.mixkit.co/videos/preview/mixkit-skateboarding-under-a-bridge-4451-large.mp4', user: '@skater_guy' },
    { url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-top-view-938-large.mp4', user: '@nature_loops' },
    { url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-under-neon-lights-41221-large.mp4', user: '@night_vibes' }
];

const feed = document.getElementById('video-feed');

// 2. Generate the video cards
function loadVideos() {
    videoData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <video src="${data.url}" loop playsinline></video>
            <div class="video-info">
                <h3>${data.user}</h3>
            </div>
        `;
        feed.appendChild(card);
    });
}

// 3. Play/Pause logic using Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
            video.play();
        } else {
            video.pause();
            video.currentTime = 0; // Reset to start
        }
    });
}, { threshold: 0.7 });

function startApp() {
    document.getElementById('start-overlay').style.display = 'none';
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => observer.observe(card));
}

// Initialize
loadVideos();
