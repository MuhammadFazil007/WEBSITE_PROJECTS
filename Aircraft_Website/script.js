// ===== SAMPLE AIRCRAFT DATA =====
let aircraftData = [
    {
        id: 1,
        name: "Boeing 747",
        manufacturer: "Boeing",
        type: "Civil",
        speed: 910,
        range: 14688,
        firstFlight: 1969,
        emoji: "✈️"
    },
    {
        id: 2,
        name: "Airbus A380",
        manufacturer: "Airbus",
        type: "Civil",
        speed: 903,
        range: 15700,
        firstFlight: 2007,
        emoji: "🛫"
    },
    {
        id: 3,
        name: "F-16 Fighting Falcon",
        manufacturer: "General Dynamics",
        type: "Fighter",
        speed: 2124,
        range: 860,
        firstFlight: 1974,
        emoji: "🚀"
    },
    {
        id: 4,
        name: "Airbus A350",
        manufacturer: "Airbus",
        type: "Civil",
        speed: 956,
        range: 15000,
        firstFlight: 2013,
        emoji: "✈️"
    },
    {
        id: 5,
        name: "Apache Helicopter",
        manufacturer: "Boeing",
        type: "Military",
        speed: 365,
        range: 1900,
        firstFlight: 1984,
        emoji: "🚁"
    }
];

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');

    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');
    event.target.classList.add('active');

    if (pageId === 'aircraft') {
        displayAircraft();
    }

    window.scrollTo(0, 0);
}

// ===== DISPLAY AIRCRAFT LIST =====
function displayAircraft() {
    const grid = document.getElementById('aircraftGrid');
    grid.innerHTML = '';

    aircraftData.forEach(aircraft => {
        const card = document.createElement('div');
        card.className = 'aircraft-card';
        card.onclick = () => showDetail(aircraft.id);
        
        card.innerHTML = `
            <div class="aircraft-image">${aircraft.emoji}</div>
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

// ===== SEARCH & FILTER =====
function filterAircraft() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;

    const filtered = aircraftData.filter(aircraft => {
        const matchName = aircraft.name.toLowerCase().includes(searchTerm);
        const matchType = typeFilter === '' || aircraft.type === typeFilter;
        return matchName && matchType;
    });

    const grid = document.getElementById('aircraftGrid');
    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No aircraft found matching your criteria.</p>';
        return;
    }

    filtered.forEach(aircraft => {
        const card = document.createElement('div');
        card.className = 'aircraft-card';
        card.onclick = () => showDetail(aircraft.id);
        
        card.innerHTML = `
            <div class="aircraft-image">${aircraft.emoji}</div>
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

// ===== SHOW AIRCRAFT DETAIL =====
function showDetail(aircraftId) {
    const aircraft = aircraftData.find(a => a.id === aircraftId);
    if (!aircraft) return;

    const detailContainer = document.getElementById('detailContainer');
    detailContainer.innerHTML = `
        <div class="detail-header">
            <div class="detail-image">${aircraft.emoji}</div>
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

    document.getElementById('detail').classList.add('active');
    document.getElementById('aircraft').classList.remove('active');
    document.getElementById('home').classList.remove('active');
    document.getElementById('add').classList.remove('active');
    document.getElementById('about').classList.remove('active');
    window.scrollTo(0, 0);
}

// ===== ADD NEW AIRCRAFT =====
function addAircraft(event) {
    event.preventDefault();

    const newAircraft = {
        id: aircraftData.length + 1,
        name: document.getElementById('aircraftName').value,
        manufacturer: document.getElementById('manufacturer').value,
        type: document.getElementById('aircraftType').value,
        speed: parseInt(document.getElementById('maxSpeed').value),
        range: parseInt(document.getElementById('range').value),
        firstFlight: parseInt(document.getElementById('firstFlight').value),
        emoji: document.getElementById('emoji').value
    };

    aircraftData.push(newAircraft);
    alert('✅ Aircraft added successfully!');
    event.target.reset();
    showPage('aircraft');
}