const API_URL = "https://script.google.com/macros/s/AKfycbyE2SaVGZiQQr34g3McCJlqZn87EvMJAA2RnJoBRnxaTfrJUxyx4wCLCphyb91-BSAQCw/exec";

let menuData = [];
let momentData = [];

async function fetchSpreadsheetData() {
    const cachedData = localStorage.getItem('jaws_data_cache');
    if (cachedData) {
        try {
            const parsedData = JSON.parse(cachedData);
            menuData = parsedData.menu || [];
            momentData = parsedData.moment || [];
            renderMenu();
            renderMoment();
            console.log("Menampilkan data dari cache lokal (Cepat)");
        } catch (e) {
            console.error("Cache rusak, akan ambil data baru.");
        }
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Gagal mengambil data");
        
        const freshData = await response.json();
        
        if (JSON.stringify(freshData) !== cachedData) {
            menuData = freshData.menu || [];
            momentData = freshData.moment || [];
            
            localStorage.setItem('jaws_data_cache', JSON.stringify(freshData));
            
            renderMenu();
            renderMoment();
            console.log("Data terbaru berhasil diperbarui dari Spreadsheet.");
        } else {
            console.log("Data Spreadsheet tidak ada perubahan.");
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        if (!cachedData) {
            document.getElementById('menuContainer').innerHTML = '<div class="error-msg" style="color:red; text-align:center; padding: 20px;">Gagal memuat menu. Cek koneksi atau URL API kamu.</div>';
            document.getElementById('momentContainer').innerHTML = '<div class="error-msg" style="color:red; text-align:center; padding: 20px;">Gagal memuat moment. Cek koneksi atau URL API kamu.</div>';
        }
    }
}

function fixDriveImageUrl(url) {
    if (!url) return '';
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        const id = match[1];
        return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
    }
    return url;
}

function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;

    if (menuData.length === 0) {
        container.innerHTML = '<div class="no-results">Ora ono menu nang kene 🤷‍♂️</div>';
        return;
    }

    container.innerHTML = menuData.map(item => {
        const safeImageUrl = fixDriveImageUrl(item.image_url);
        
        return `
        <div class="menu-card">
            <div class="menu-img-container">
                <img class="menu-img" 
                     src="${safeImageUrl}" 
                     alt="${escapeHtml(item.name)}"
                     onerror="this.src='https://placehold.co/400x300/red/white?text=No+Image'">
            </div>
            <div class="menu-info">
                <h3 class="menu-title">${escapeHtml(item.name)}</h3>
                <p class="menu-desc">${escapeHtml(item.desc)}</p>
                <div class="menu-bottom">
                    <span class="menu-price">${escapeHtml(item.price)}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function renderMoment() {
    const container = document.getElementById('momentContainer');
    if (!container) return;

    if (momentData.length === 0) {
        container.innerHTML = '<div class="no-results">Ora ono moment nang kene 📸</div>';
        return;
    }

    container.innerHTML = momentData.map((item, index) => {
        const safeImageUrl = fixDriveImageUrl(item.image_url);
        
        let sizeClass = '';
        if (index % 3 === 0) {
            sizeClass = 'moment-tall';
        } else if (index % 5 === 0) {
            sizeClass = 'moment-wide';
        }

        return `
            <div class="moment-card ${sizeClass}">
                <img class="moment-img" 
                     src="${safeImageUrl}" 
                     alt="Moment ${item.id}"
                     onerror="this.src='https://placehold.co/400x300/FFD700/3E0B0E?text=Jaws+Moment'">
            </div>
        `;
    }).join('');
}

function orderNow(itemName) {
    const waNumber = "628xxxxxxxxxx";
    const message = `Halo Jaws Burger, saya mau order ${itemName}`;
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
}

function setActiveMenu() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    if (window.scrollY < 100) current = 'home';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === current) link.classList.add('active');
    });
}

function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Website JAWS BURGER berjalan!");
    
    setupSmoothScroll();
    setActiveMenu();
    window.addEventListener('scroll', setActiveMenu);
    window.addEventListener('resize', setActiveMenu);

    fetchSpreadsheetData();
});