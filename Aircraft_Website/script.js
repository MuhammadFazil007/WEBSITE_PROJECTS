// ============================================================
//  AVIATION HUB — script.js
//  Features: Auth (localStorage), Persistent Aircraft Data,
//            Image Uploads (base64), Search & Filter
// ============================================================

// ===== DEFAULT AIRCRAFT DATA (seeded once) =====
const DEFAULT_AIRCRAFT = [
    {
        id: 1,
        name: "Boeing 747",
        manufacturer: "Boeing",
        type: "Civil",
        speed: 910,
        range: 14688,
        firstFlight: 1969,
        emoji: "✈️",
        image: null
    },
    {
        id: 2,
        name: "Airbus A380",
        manufacturer: "Airbus",
        type: "Civil",
        speed: 903,
        range: 15700,
        firstFlight: 2007,
        emoji: "🛫",
        image: null
    },
    {
        id: 3,
        name: "F-16 Fighting Falcon",
        manufacturer: "General Dynamics",
        type: "Fighter",
        speed: 2124,
        range: 860,
        firstFlight: 1974,
        emoji: "🚀",
        image: null
    },
    {
        id: 4,
        name: "Airbus A350",
        manufacturer: "Airbus",
        type: "Civil",
        speed: 956,
        range: 15000,
        firstFlight: 2013,
        emoji: "✈️",
        image: null
    },
    {
        id: 5,
        name: "Apache Helicopter",
        manufacturer: "Boeing",
        type: "Military",
        speed: 365,
        range: 1900,
        firstFlight: 1984,
        emoji: "🚁",
        image: null
    }
];

// ===== STORAGE HELPERS =====

function getUsers() {
    return JSON.parse(localStorage.getItem('ah_users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('ah_users', JSON.stringify(users));
}

function getAircraftData() {
    const stored = localStorage.getItem('ah_aircraft');
    if (!stored) {
        // Seed defaults on first load
        saveAircraftData(DEFAULT_AIRCRAFT);
        return DEFAULT_AIRCRAFT;
    }
    return JSON.parse(stored);
}

function saveAircraftData(data) {
    localStorage.setItem('ah_aircraft', JSON.stringify(data));
}

function getCurrentUser() {
    return localStorage.getItem('ah_current_user');
}

function setCurrentUser(username) {
    localStorage.setItem('ah_current_user', username);
}

function clearCurrentUser() {
    localStorage.removeItem('ah_current_user');
}

// Working in-memory copy (synced to localStorage on every change)
let aircraftData = getAircraftData();
// ===== DEFAULT USER SEED =====
function seedDefaultUser() {

    let users = getUsers();

    // Check karo admin user already exist karta hy ya nahi
    const adminExists = users.some(user => user.username === 'admin');

    // Agar exist nahi karta to add karo
    if (!adminExists) {

        users.push({
            username: 'admin',
            password: '12345'
        });

        saveUsers(users);
    }
}

// Default user create karo
seedDefaultUser();
// ===== INIT ON PAGE LOAD =====
window.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (user) {
        showApp(user);
    }
    // else login overlay is already visible by default
});

// ===== AUTH: SWITCH PANELS =====
function switchAuth(panel) {
    document.getElementById('loginPanel').classList.toggle('active', panel === 'login');
    document.getElementById('registerPanel').classList.toggle('active', panel === 'register');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// ===== AUTH: LOGIN =====
function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');

    if (!username || !password) {
        errEl.textContent = 'Please fill in both fields.';
        return;
    }

    const users = getUsers();
    const match = users.find(u => u.username === username && u.password === password);

    if (!match) {
        errEl.textContent = 'Incorrect username or password.';
        return;
    }

    setCurrentUser(username);
    showApp(username);
}

// ===== AUTH: REGISTER =====
function handleRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;
    const errEl    = document.getElementById('registerError');

    if (!username || !password || !confirm) {
        errEl.textContent = 'Please fill in all fields.';
        return;
    }
    if (password !== confirm) {
        errEl.textContent = 'Passwords do not match.';
        return;
    }
    if (password.length < 4) {
        errEl.textContent = 'Password must be at least 4 characters.';
        return;
    }

    const users = getUsers();
    if (users.find(u => u.username === username)) {
        errEl.textContent = 'Username already taken. Choose another.';
        return;
    }

    users.push({ username, password });
    saveUsers(users);
    setCurrentUser(username);
    showApp(username);
}

// ===== AUTH: LOGOUT =====
function handleLogout() {
    clearCurrentUser();
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('authOverlay').style.display = 'flex';
    // Reset login form
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').textContent = '';
    switchAuth('login');
}

// ===== SHOW MAIN APP =====
function showApp(username) {
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('welcomeUser').textContent = '👤 ' + username;
    aircraftData = getAircraftData(); // refresh from storage
}

// ===== PAGE NAVIGATION =====
function showPage(pageId, triggerEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');
    if (triggerEl) triggerEl.classList.add('active');

    if (pageId === 'aircraft') {
        aircraftData = getAircraftData(); // always re-read before displaying
        displayAircraft(aircraftData);
    }

    window.scrollTo(0, 0);
}

// ===== RENDER AIRCRAFT GRID =====
function renderCards(list) {
    const grid = document.getElementById('aircraftGrid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:2rem;color:#999;">No aircraft found matching your criteria.</p>';
        return;
    }

    list.forEach(aircraft => {
        const card = document.createElement('div');
        card.className = 'aircraft-card';
        card.onclick = () => showDetail(aircraft.id);

        const imgContent = aircraft.image
            ? `<img src="${aircraft.image}" alt="${aircraft.name}">`
            : `<span class="emoji-display">${aircraft.emoji}</span>`;

        card.innerHTML = `
            <div class="aircraft-image">${imgContent}</div>
            <div class="aircraft-info">
                <h3>${aircraft.name}</h3>
                <span class="aircraft-type">${aircraft.type}</span>
                <div class="aircraft-meta">By: ${aircraft.manufacturer}</div>
                <div class="aircraft-meta">Max Speed: ${aircraft.speed} km/h</div>
                <div class="aircraft-meta">First Flight: ${aircraft.firstFlight}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function displayAircraft(data) {
    renderCards(data || aircraftData);
}

// ===== SEARCH & FILTER =====
function filterAircraft() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const type   = document.getElementById('typeFilter').value;

    const filtered = aircraftData.filter(a => {
        return a.name.toLowerCase().includes(search) &&
               (type === '' || a.type === type);
    });

    renderCards(filtered);
}

// ===== DETAIL PAGE =====
function showDetail(aircraftId) {
    const aircraft = aircraftData.find(a => a.id === aircraftId);
    if (!aircraft) return;

    const imgContent = aircraft.image
        ? `<img src="${aircraft.image}" alt="${aircraft.name}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`
        : `<span style="font-size:5rem;">${aircraft.emoji}</span>`;

    document.getElementById('detailContainer').innerHTML = `
        <div class="detail-header">
            <div class="detail-image">${imgContent}</div>
            <div class="detail-info">
                <h2>${aircraft.name}</h2>
                <div class="detail-specs">
                    <div class="spec-row">
                        <div class="spec-label">Manufacturer</div>
                        <div class="spec-value">${aircraft.manufacturer}</div>
                    </div>
                    <div class="spec-row">
                        <div class="spec-label">Aircraft Type</div>
                        <div class="spec-value">${aircraft.type}</div>
                    </div>
                    <div class="spec-row">
                        <div class="spec-label">Maximum Speed</div>
                        <div class="spec-value">${aircraft.speed} km/h</div>
                    </div>
                    <div class="spec-row">
                        <div class="spec-label">Range</div>
                        <div class="spec-value">${aircraft.range} km</div>
                    </div>
                    <div class="spec-row">
                        <div class="spec-label">First Flight Year</div>
                        <div class="spec-value">${aircraft.firstFlight}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Switch to detail page (without nav highlight change)
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('detail').classList.add('active');
    window.scrollTo(0, 0);
}

// ===== IMAGE UPLOAD PREVIEW =====
let uploadedImageBase64 = null;

function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageBase64 = e.target.result;
        document.getElementById('imagePreview').src = uploadedImageBase64;
        document.getElementById('imagePreviewWrap').style.display = 'block';
        document.getElementById('imageUploadArea').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function clearImage() {
    uploadedImageBase64 = null;
    document.getElementById('aircraftImage').value = '';
    document.getElementById('imagePreviewWrap').style.display = 'none';
    document.getElementById('imageUploadArea').style.display = 'flex';
}

// ===== ADD AIRCRAFT (persisted to localStorage) =====
function addAircraft(event) {
    event.preventDefault();

    const newAircraft = {
        id: Date.now(), // unique ID even after reload
        name: document.getElementById('aircraftName').value.trim(),
        manufacturer: document.getElementById('manufacturer').value.trim(),
        type: document.getElementById('aircraftType').value,
        speed: parseInt(document.getElementById('maxSpeed').value),
        range: parseInt(document.getElementById('range').value),
        firstFlight: parseInt(document.getElementById('firstFlight').value),
        emoji: document.getElementById('emoji').value || '✈️',
        image: uploadedImageBase64 || null
    };

    aircraftData.push(newAircraft);
    saveAircraftData(aircraftData); // ← persist to localStorage

    // Reset form
    event.target.reset();
    clearImage();

    // Show success flash
    showToast('✅ Aircraft added successfully!');

    // Navigate to aircraft list
    showPage('aircraft', null);
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    // mark "Aircraft" nav as active
    document.querySelectorAll('.nav-link')[1].classList.add('active');
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => toast.classList.remove('show'), 3000);
}
