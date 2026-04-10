// 1. CONNECT TO SUPABASE
const SUPABASE_URL = 'https://iuqhnnsjvmapvscfnxt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VP8vtCVFAq_jjv5vFCY-1Q_9jwJp48b'; // Use your full public key here

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const feed = document.getElementById('video-feed');

// 2. FETCH VIDEOS FROM DATABASE
async function fetchVideos() {
    const { data, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading:", error);
    } else {
        renderVideos(data);
    }
}

// 3. RENDER FEED
function renderVideos(posts) {
    feed.innerHTML = '';
    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <video src="${post.video_url}" loop playsinline></video>
            <div class="sidebar">
                <div class="action-item"><div class="icon-circle">❤️</div><span>12k</span></div>
                <div class="action-item"><div class="icon-circle">💬</div><span>42</span></div>
            </div>
            <div class="video-info">
                <h3>@${post.username}</h3>
                <p>${post.caption}</p>
            </div>
        `;

        const v = card.querySelector('video');
        v.addEventListener('click', () => v.paused ? v.play() : v.pause());
        feed.appendChild(card);
    });

    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => observer.observe(card));
}

// 4. HANDLE UPLOAD
async function handleUpload() {
    const btn = document.getElementById('publish-btn');
    const file = document.getElementById('up-file').files[0];
    const user = document.getElementById('up-user').value;
    const desc = document.getElementById('up-desc').value;

    if (!file || !user) return alert("Missing info!");

    btn.innerText = "UPLOADING...";
    btn.disabled = true;

    // A. Upload File to Storage
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await _supabase.storage
        .from('videos')
        .upload(fileName, file);

    if (uploadError) {
        alert("Upload error: " + uploadError.message);
        btn.innerText = "PUBLISH";
        btn.disabled = false;
        return;
    }

    // B. Get Link
    const { data: urlData } = _supabase.storage.from('videos').getPublicUrl(fileName);

    // C. Save to Table
    const { error: dbError } = await _supabase
        .from('posts')
        .insert([{ username: user, caption: desc, video_url: urlData.publicUrl }]);

    if (dbError) {
        alert("Database error: " + dbError.message);
    } else {
        alert("Success!");
        location.reload();
    }
}

// UI HELPERS
function openUpload() { document.getElementById('upload-modal').style.display = 'block'; }
function closeUpload() { document.getElementById('upload-modal').style.display = 'none'; }

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
}, { threshold: 0.7 });

function startApp() {
    document.getElementById('start-overlay').style.display = 'none';
    document.querySelectorAll('video').forEach(v => v.muted = false);
}

// LOAD ON START
fetchVideos();
