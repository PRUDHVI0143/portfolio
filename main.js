// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form AJAX Submission
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'SENDING... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';
        submitBtn.disabled = true;
        formStatus.style.display = 'none';

        const formData = new FormData(contactForm);
        const object = {};
        formData.forEach((value, key) => { object[key] = value });
        
        fetch('https://formsubmit.co/ajax/prudhvid78@gmail.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(object)
        })
        .then(response => response.json())
        .then(data => {
            if(data.success === "true" || data.success === true){
                formStatus.style.display = 'block';
                formStatus.innerHTML = '<span style="color: #4CAF50;"><i class="fas fa-check-circle"></i> Message sent successfully! I will get back to you soon.</span>';
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
            } else {
                contactForm.submit(); 
            }
        })
        .catch(error => {
            console.log("AJAX failed. Falling back to standard submit...");
            contactForm.submit();
        });
    });
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(5, 5, 15, 0.85)';
            nav.style.borderBottom = '1px solid rgba(138, 43, 226, 0.3)';
        } else {
            nav.style.background = 'rgba(11, 11, 11, 0.8)';
            nav.style.borderBottom = 'var(--border)';
        }
    }
});

// Certification Lightbox Gallery
let currentCertIndex = 0;
const certCards = document.querySelectorAll('.cert-card');
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');

window.openCertModal = function(index) {
    if (window.isGravityOn) return; 
    currentCertIndex = index;
    updateModalContent();
    if(certModal) {
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
}

window.closeCertModal = function() {
    if(certModal) {
        certModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

window.changeCert = function(step, event) {
    if(event) event.stopPropagation();
    currentCertIndex += step;
    if (currentCertIndex >= certCards.length) currentCertIndex = 0;
    if (currentCertIndex < 0) currentCertIndex = certCards.length - 1;
    updateModalContent();
}

function updateModalContent() {
    const card = certCards[currentCertIndex];
    if(card && modalImg && modalCaption) {
        const img = card.querySelector('.cert-img-wrapper img');
        const title = card.querySelector('.cert-content h3');
        const institution = card.querySelector('.fas.fa-certificate + span');
        const dateSpan = card.querySelector('.cert-content > div:last-child span');
        
        if(img) modalImg.src = img.src;
        if(title) {
            const instText = institution ? institution.innerText : '';
            const dateText = dateSpan ? dateSpan.innerText : '';
            const titleText = title.innerText;

            modalCaption.innerHTML = `
                <div style="font-size: 0.8rem; letter-spacing: 1px; color: var(--accent-primary); margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 700;">
                    ${instText}
                </div>
                <div style="font-size: 1.3rem; color: #fff; font-weight: 800; margin-bottom: 0.5rem; text-transform: none;">
                    ${titleText}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-sec); font-weight: 600;">
                    ISSUED: <span style="color: #fff;">${dateText}</span>
                </div>
            `;
        }
    }
}

if(certModal) {
    certModal.addEventListener('click', function(e) {
        if(e.target === certModal) {
            closeCertModal();
        }
    });
}

// Comet Trail Cursor & Glowing Effect
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');
const cursorParticles = [];

function createCursorParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    const vx = (Math.random() - 0.5) * 2;
    const vy = (Math.random() - 0.5) * 2;
    
    document.body.appendChild(p);
    
    cursorParticles.push({
        el: p,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02
    });
}

function updateCursorParticles() {
    for (let i = cursorParticles.length - 1; i >= 0; i--) {
        const p = cursorParticles[i];
        p.life -= p.decay;
        
        if (p.life <= 0) {
            p.el.remove();
            cursorParticles.splice(i, 1);
            continue;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
        p.el.style.opacity = p.life;
        p.el.style.transform = `scale(${p.life})`;
    }
    requestAnimationFrame(updateCursorParticles);
}

window.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.85) {
        createCursorParticle(e.clientX, e.clientY);
    }
});

updateCursorParticles();

// Parallax Interaction
const layers = document.querySelectorAll(".cosmos-layer");
let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

window.addEventListener('resize', () => {
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
});

// Cosmic Sound Effects (Web Audio API)
let audioCtx;

function initAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
    } catch(e) {
        console.warn("AudioContext not allowed or unsupported.");
    }
}

function playSpaceSound(freq, type = 'sine', duration = 0.1, volume = 0.05) {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    try {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + duration);
        
        g.gain.setValueAtTime(volume, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        osc.connect(g);
        g.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

document.addEventListener('click', () => {
    if (!audioCtx) initAudio();
}, { once: true });

// Organic Space Flora & Bioluminescent Alien Plants
function createSpacePlants() {
    const starfield = document.querySelector('.cosmos-bg');
    if (!starfield) return;
    const plantCount = 18;
    const plantTemplates = [
        `<svg viewBox="0 0 100 120" style="width:100%; height:100%; overflow:visible;">
            <defs>
                <linearGradient id="pGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95" />
                    <stop offset="50%" stop-color="#818cf8" stop-opacity="0.85" />
                    <stop offset="100%" stop-color="#c084fc" stop-opacity="0.95" />
                </linearGradient>
            </defs>
            <path d="M50,110 Q45,60 10,40 Q40,45 50,110 M50,110 Q55,50 90,30 Q60,40 50,110 M50,110 Q50,10 50,5" stroke="url(#pGrad1)" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <path d="M50,80 Q25,65 15,60 M50,60 Q75,45 85,40 M50,40 Q30,25 20,20 M50,25 Q70,15 80,10" stroke="url(#pGrad1)" stroke-width="2" fill="none" opacity="0.8"/>
            <circle cx="50" cy="5" r="4" fill="#c084fc" filter="drop-shadow(0 0 8px #c084fc)" />
            <circle cx="10" cy="40" r="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            <circle cx="90" cy="30" r="3" fill="#818cf8" filter="drop-shadow(0 0 6px #818cf8)" />
        </svg>`,
        `<svg viewBox="0 0 100 100" style="width:100%; height:100%; overflow:visible;">
            <defs>
                <radialGradient id="pGrad2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#f43f5e" />
                    <stop offset="70%" stop-color="#881337" />
                    <stop offset="100%" stop-color="#4c0519" />
                </radialGradient>
            </defs>
            <path d="M50,10 Q65,40 50,90 Q35,40 50,10 Z" fill="url(#pGrad2)" opacity="0.9" />
            <path d="M50,90 Q10,50 20,20 Q60,30 50,90 Z" fill="url(#pGrad2)" opacity="0.75" />
            <path d="M50,90 Q90,50 80,20 Q40,30 50,90 Z" fill="url(#pGrad2)" opacity="0.75" />
            <circle cx="50" cy="45" r="6" fill="#fbbf24" filter="drop-shadow(0 0 10px #fbbf24)" />
        </svg>`,
        `<svg viewBox="0 0 80 120" style="width:100%; height:100%; overflow:visible;">
            <path d="M10,110 Q70,90 20,60 T70,10" stroke="#34d399" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="20" cy="60" r="5" fill="#a7f3d0" filter="drop-shadow(0 0 8px #34d399)" />
            <circle cx="70" cy="10" r="6" fill="#6ee7b7" filter="drop-shadow(0 0 10px #6ee7b7)" />
        </svg>`
    ];

    for (let i = 0; i < plantCount; i++) {
        const plant = document.createElement('div');
        plant.className = 'space-plant';
        
        const size = Math.random() * 65 + 45;
        const x = Math.random() * 95;
        const y = Math.random() * 95;
        const duration = Math.random() * 8 + 8;
        const delay = Math.random() * -15;
        const svgContent = plantTemplates[Math.floor(Math.random() * plantTemplates.length)];
        
        plant.style.left = `${x}%`;
        plant.style.top = `${y}%`;
        plant.style.width = `${size}px`;
        plant.style.height = `${size}px`;
        plant.style.setProperty('--sway-duration', `${duration}s`);
        plant.style.animationDelay = `${delay}s`;
        plant.innerHTML = svgContent;
        
        starfield.appendChild(plant);
    }
}

// Master Procedural Texture Generator Engine for All Solar System Planets
function generateProceduralPlanetTexture(planetName, size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size; 
    canvas.height = size / 2;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    if (planetName === 'mercury') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#e5e7eb');
        grad.addColorStop(0.5, '#6b7280');
        grad.addColorStop(1, '#374151');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 7000; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 8 + 1;
            const shade = Math.random();
            ctx.fillStyle = shade < 0.5 ? `rgba(20,20,20,${Math.random() * 0.3})` : `rgba(220,220,220,${Math.random() * 0.25})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        for (let i = 0; i < 160; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 12 + 2;
            const crater = ctx.createRadialGradient(x, y, 0, x, y, r);
            crater.addColorStop(0, 'rgba(15,15,15,0.7)');
            crater.addColorStop(0.7, 'rgba(230,230,230,0.3)');
            crater.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = crater;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
    } 
    else if (planetName === 'pluto') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#fef3c7');
        grad.addColorStop(0.3, '#d97706');
        grad.addColorStop(0.7, '#78350f');
        grad.addColorStop(1, '#451a03');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 8000; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 9 + 1;
            const shade = Math.random();
            ctx.fillStyle = shade < 0.5 ? `rgba(50,15,5,${Math.random() * 0.3})` : `rgba(255,240,200,${Math.random() * 0.25})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        for (let i = 0; i < 110; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 14 + 3;
            const crater = ctx.createRadialGradient(x, y, 0, x, y, r);
            crater.addColorStop(0, 'rgba(30,8,2,0.65)');
            crater.addColorStop(0.6, 'rgba(254,243,199,0.35)');
            crater.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = crater;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        // Tombaugh Regio Heart (Nitrogen Ice Glacier)
        ctx.fillStyle = 'rgba(255,255,245,0.92)';
        ctx.beginPath();
        ctx.ellipse(w * 0.45, h * 0.5, w * 0.12, h * 0.22, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(w * 0.58, h * 0.52, w * 0.1, h * 0.2, 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (planetName === 'earth') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1e40af');
        grad.addColorStop(0.5, '#2563eb');
        grad.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Continents (Green & Brown Landmasses)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
        for (let i = 0; i < 45; i++) {
            const x = Math.random() * w;
            const y = Math.random() * (h * 0.7) + h * 0.15;
            const rx = Math.random() * 45 + 20;
            const ry = Math.random() * 30 + 15;
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = 'rgba(161, 98, 7, 0.75)';
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * w;
            const y = Math.random() * (h * 0.6) + h * 0.2;
            const rx = Math.random() * 30 + 10;
            const ry = Math.random() * 20 + 8;
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        // Polar Ice Caps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath(); ctx.ellipse(w / 2, 8, w / 2, 24, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(w / 2, h - 8, w / 2, 24, 0, 0, Math.PI * 2); ctx.fill();

        // Atmospheric Swirling Cloud Bands
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        for (let i = 0; i < 30; i++) {
            const y = Math.random() * h;
            ctx.fillRect(0, y, w, Math.random() * 12 + 4);
        }
    }
    else if (planetName === 'mars') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#d9c3ad');
        grad.addColorStop(0.12, '#b5573a');
        grad.addColorStop(0.5, '#a8461f');
        grad.addColorStop(0.88, '#b5573a');
        grad.addColorStop(1, '#d9c3ad');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 9000; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 10 + 1;
            const shade = Math.random();
            ctx.fillStyle = shade < 0.5 ? `rgba(90,35,15,${Math.random() * 0.25})` : `rgba(220,190,160,${Math.random() * 0.15})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        for (let i = 0; i < 140; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 14 + 3;
            const crater = ctx.createRadialGradient(x, y, 0, x, y, r);
            crater.addColorStop(0, 'rgba(40,15,5,0.55)');
            crater.addColorStop(0.6, 'rgba(40,15,5,0.25)');
            crater.addColorStop(1, 'rgba(40,15,5,0)');
            ctx.fillStyle = crater;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = 'rgba(235,225,215,0.85)';
        ctx.beginPath(); ctx.ellipse(w / 2, 8, w / 2, 22, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(w / 2, h - 8, w / 2, 22, 0, 0, Math.PI * 2); ctx.fill();
    }
    else if (planetName === 'jupiter') {
        const bands = ['#fef3c7', '#f59e0b', '#d97706', '#78350f', '#fbbf24', '#b45309', '#fed7aa', '#9a3412'];
        const bandH = h / 20;
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = bands[i % bands.length];
            ctx.fillRect(0, i * bandH, w, bandH);
        }

        for (let i = 0; i < 600; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const rx = Math.random() * 25 + 5;
            const ry = Math.random() * 6 + 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
        }

        // Great Red Spot Storm
        const spotX = w * 0.65;
        const spotY = h * 0.62;
        const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 35);
        spotGrad.addColorStop(0, '#ef4444');
        spotGrad.addColorStop(0.6, '#b91c1c');
        spotGrad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = spotGrad;
        ctx.beginPath(); ctx.ellipse(spotX, spotY, 38, 22, -0.1, 0, Math.PI * 2); ctx.fill();
    }
    else if (planetName === 'saturn') {
        const bands = ['#fef08a', '#eab308', '#ca8a04', '#713f12', '#fef9c3', '#a16207'];
        const bandH = h / 16;
        for (let i = 0; i < 16; i++) {
            ctx.fillStyle = bands[i % bands.length];
            ctx.fillRect(0, i * bandH, w, bandH);
        }

        for (let i = 0; i < 400; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.25})`;
            ctx.fillRect(x, y, Math.random() * 40 + 10, Math.random() * 3 + 1);
        }
    }
    else if (planetName === 'uranus') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#cff4fc');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, '#164e63');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        for (let i = 0; i < 15; i++) {
            ctx.fillRect(0, Math.random() * h, w, Math.random() * 6 + 2);
        }
    }
    else if (planetName === 'neptune') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#60a5fa');
        grad.addColorStop(0.5, '#1d4ed8');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Great Dark Spot
        const spotGrad = ctx.createRadialGradient(w * 0.4, h * 0.45, 0, w * 0.4, h * 0.45, 25);
        spotGrad.addColorStop(0, '#1e1b4b');
        spotGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath(); ctx.ellipse(w * 0.4, h * 0.45, 30, 18, 0.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.fillRect(x, y, Math.random() * 50 + 15, Math.random() * 4 + 1);
        }
    }

    return canvas.toDataURL();
}

// 2D Interactive Solar System Planets
function createPlanets() {
    const starfield = document.querySelector('.cosmos-bg');
    if (!starfield) return;

    const planetsData = [
        { name: 'mercury', label: 'Mercury', top: 15, left: 10, depth: 40 },
        { name: 'pluto', label: 'Pluto', top: 25, left: 85, depth: 30 },
        { name: 'earth', label: 'Earth', top: 45, left: 15, depth: 25 },
        { name: 'mars', label: 'Mars', top: 65, left: 80, depth: 35 },
        { name: 'jupiter', label: 'Jupiter', top: 110, left: 75, depth: 20 },
        { name: 'saturn', label: 'Saturn', top: 140, left: 10, depth: 15 },
        { name: 'uranus', label: 'Uranus', top: 170, left: 85, depth: 25 },
        { name: 'neptune', label: 'Neptune', top: 195, left: 20, depth: 30 }
    ];

    planetsData.forEach(data => {
        const planet = document.createElement('div');
        planet.className = `planet ${data.name} planet-pulse`;
        planet.style.top = `${data.top}%`;
        planet.style.left = `${data.left}%`;
        planet.setAttribute('data-depth', data.depth);

        // Apply dynamic procedural texture canvas URL for ALL planets!
        const textureDataUrl = generateProceduralPlanetTexture(data.name, 512);
        planet.style.backgroundImage = `url(${textureDataUrl})`;
        planet.style.backgroundSize = 'cover';
        planet.style.backgroundPosition = 'center';

        const label = document.createElement('span');
        label.className = 'planet-label';
        label.innerText = data.label;
        
        planet.appendChild(label);
        starfield.appendChild(planet);
        
        planet.addEventListener('click', () => {
            playSpaceSound(660, 'sine', 0.4, 0.08);
            planet.style.transform = 'scale(2) rotate(360deg)';
            setTimeout(() => {
                planet.style.transform = '';
            }, 1000);
        });
    });
}

function updateParallax(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const dx = (mouseX - centerX) / centerX;
    const dy = (mouseY - centerY) / centerY;

    layers.forEach((layer, index) => {
        const depth = (index + 1) * 15; 
        const translateX = -dx * depth;
        const translateY = -dy * depth;
        layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });

    const planets = document.querySelectorAll(".planet");
    planets.forEach(planet => {
        const depth = parseFloat(planet.getAttribute('data-depth')) || 20;
        const translateX = -dx * depth;
        const translateY = -dy * depth;
        planet.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });

    const plants = document.querySelectorAll(".space-plant");
    plants.forEach(plant => {
        const rect = plant.getBoundingClientRect();
        const plantX = rect.left + rect.width / 2;
        const plantY = rect.top + rect.height / 2;
        
        const distDX = mouseX - plantX;
        const distDY = mouseY - plantY;
        const distance = Math.sqrt(distDX * distDX + distDY * distDY);
        
        if (distance < 200) {
            const power = (200 - distance) / 200;
            const moveX = (distDX / distance) * -30 * power;
            const moveY = (distDY / distance) * -30 * power;
            plant.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX}deg)`;
        } else {
            plant.style.transform = `translate(0, 0) rotate(0deg)`;
        }
    });

    if(cursor) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    }
    if(cursorBlur) {
        setTimeout(() => {
            cursorBlur.style.left = mouseX + "px";
            cursorBlur.style.top = mouseY + "px";
        }, 80);
    }
}

window.addEventListener("mousemove", (e) => {
    updateParallax(e);
});

// Scroll Progress Bar
const scrollProgress = document.getElementById("scroll-progress");
window.addEventListener('scroll', () => {
    if(scrollProgress) {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
        scrollProgress.style.width = scrolled;
    }
});

// Vanilla Tilt Initialization
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.1,
        scale: 1.02
    });
}

// ----------------------------------------------------
// Project Deep Dive Architecture Modal Handlers
// ----------------------------------------------------
const projectDetails = {
    'fake-account-detection': {
        title: "Fake Social Media Account & Bot Detection Engine",
        subtitle: "Machine Learning Classifier & NLP Sentiment Analytics",
        img: "fake_account_detection.png",
        github: "https://github.com/Saathwikmanthri/Fake-Social-Media-Accounts-Detection",
        tags: ["Machine Learning", "Python", "Scikit-Learn", "XGBoost", "NLP", "Flask"],
        overview: "An automated threat intelligence and classification pipeline designed to ingest, clean, and analyze multi-dimensional social media metadata to flag botnet nodes, fraudulent personas, and malicious spam automation.",
        architecture: [
            "<strong>Data Ingestion & Feature Engineering:</strong> Parses profile age, follower-to-following ratios, posting velocity, default avatar states, and bio sentiment entropy.",
            "<strong>Model Ensembles:</strong> Trained Random Forest and XGBoost classifiers against synthetic & real-world datasets, achieving high precision (>94%).",
            "<strong>Real-time Inference API:</strong> Flask web interface allowing instant single-profile or bulk CSV URL auditing with visual risk confidence scores."
        ]
    },
    'ai-health-diagnosis': {
        title: "Intelligent AI Health Triage & Diagnostic Engine",
        subtitle: "Predictive Analytics & Clinical Decision Support System",
        img: "ai_health_tech_v2.png",
        github: "https://github.com/PRUDHVI0143/Ai-health-diagnosis",
        tags: ["AI/ML", "Python", "Django", "Predictive Analytics", "Data Science", "Web App"],
        overview: "A patient-centric health diagnostic web application empowering users to input multi-symptom conditions and receive instant triage guidance, statistical disease probabilities, and emergency escalation alerts.",
        architecture: [
            "<strong>Symptom Vectorization:</strong> Converts qualitative user inputs into structured medical vectors mapped to ICD database features.",
            "<strong>Predictive Classification:</strong> Evaluates inputs against trained decision tree & Naive Bayes classifiers to rank potential health conditions.",
            "<strong>Responsive Triage Interface:</strong> Interactive symptom selector with dynamic confidence radar graphs and automated PDF medical report export."
        ]
    },
    'f-zon3': {
        title: "F_ZON3 — Interactive Web Mini-Game Suite",
        subtitle: "Full-Stack Web App & High-Performance State Engine",
        img: "f_zon3_mockup2.png",
        github: "https://github.com/PRUDHVI0143/F_Zon3",
        tags: ["Full-Stack", "JavaScript", "HTML5 Canvas", "Game Physics", "Node.js", "Web Audio"],
        overview: "A vibrant, responsive web application housing a collection of retro and modern mini-games built with raw HTML5 Canvas, modular JavaScript ES6+, zero external framework bloat, and crisp 60 FPS physics.",
        architecture: [
            "<strong>Canvas Rendering Pipeline:</strong> High-performance requestAnimationFrame loop with sprite sheet management and collision detection.",
            "<strong>Modular Game State Engine:</strong> Pub/sub event bus decoupling game logic, score tracking, local storage high-scores, and audio synth triggers.",
            "<strong>Polished Cosmic UI:</strong> Custom CSS glassmorphism layout, sound effect toggles, and seamless transition animations between game rooms."
        ]
    },
    'spotlite': {
        title: "Spotlite — Real-Time Developer & Code Analytics Dashboard",
        subtitle: "Full-Stack Code Intelligence, Monitoring & Performance Metrics",
        img: "spotlite_mockup.jpg",
        github: "https://github.com/PRUDHVI0143/Spotlite",
        tags: ["Full-Stack", "JavaScript", "Developer Tools", "Real-Time Analytics", "Web App"],
        overview: "Spotlite is a powerful real-time developer monitoring and analytics platform engineered to track code execution performance, system event logs, latency metrics, and deployment pipelines.",
        architecture: [
            "<strong>Real-time Metrics Pipeline:</strong> Ingests system logs, API request latencies, and event activity streams with dynamic glassmorphism dashboard widgets.",
            "<strong>Code Performance Monitor:</strong> Built-in web editor interface tracking server node health, response time graphs, and error metrics per hour.",
            "<strong>Modular Architecture:</strong> Decoupled frontend event listeners connected to light-weight API endpoints for sub-millisecond status reporting."
        ]
    },
    'js-ts-compiler': {
        title: "JS-TS Compiler — AST Code Transformer & Transpiler",
        subtitle: "Compiler Design, Abstract Syntax Tree Parsing & Type Inference Engine",
        img: "compiler_mockup.jpg",
        github: "https://github.com/PRUDHVI0143/JS-TS-compiler",
        tags: ["Compiler Design", "TypeScript", "JavaScript", "AST Parsing", "Type Inference", "Node.js"],
        overview: "JS-TS Compiler is a high-speed JavaScript to TypeScript code transpiler and static analysis tool that parses JavaScript source code, builds an Abstract Syntax Tree (AST), infers strict TypeScript types, and emits typed code.",
        architecture: [
            "<strong>Lexical & Syntactic Parser:</strong> Tokenizes raw JS code into an AST representation using custom recursive descent lexer & parser rules.",
            "<strong>Type Inference Engine:</strong> Analyzes variable declarations, function parameters, and return statements to automatically inject accurate TypeScript interfaces and types.",
            "<strong>AST Visualizer IDE:</strong> Interactive dual-pane editor rendering real-time AST node graphs, compilation logs, and line-by-line code transpilations."
        ]
    },
    'vc-soul': {
        title: "Vc_Soul-0.2 — AI Voice Agent & Speech Intelligence Platform",
        subtitle: "Neural Audio Analysis, Voice Activity & Sentiment Engine",
        img: "vcsoul_mockup.jpg",
        github: "https://github.com/PRUDHVI0143/Vc_Soul-0.2",
        tags: ["Voice AI", "Audio Processing", "Neural Networks", "Python", "Speech Analytics", "Real-time AI"],
        overview: "Vc_Soul-0.2 is an advanced Voice AI and audio intelligence platform built for real-time speech-to-text processing, tonal sentiment analysis, speaker identification, and neural voice activity graph visualizations.",
        architecture: [
            "<strong>Neural Audio Spectrum Engine:</strong> Real-time FFT audio frequency analysis displaying live soundwave spectrums across 20Hz to 20kHz channels.",
            "<strong>Voice Activity Neural Graph:</strong> Multi-dimensional neural mapping evaluating speaker intent, emotion, cadence, tone, and context with >98% accuracy.",
            "<strong>Real-Time Speech Analytics:</strong> Low-latency speech-to-text streaming pipeline with tonal disposition scoring and active speaker confidence metrics."
        ]
    }
};

window.openProjectModal = function(projectId) {
    if (window.isGravityOn) return;
    const project = projectDetails[projectId];
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('project-modal-body');

    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <img src="${project.img}" alt="${project.title}" style="max-height: 280px; width: 100%; object-fit: cover; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
            </div>
            <div style="font-size: 0.8rem; letter-spacing: 2px; color: var(--accent-primary); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem;">
                ${project.subtitle}
            </div>
            <h2 style="font-size: 1.8rem; color: #fff; font-weight: 800; margin-bottom: 1rem; line-height: 1.3;">
                ${project.title}
            </h2>
            
            <div class="tech-tags" style="margin-bottom: 1.5rem;">
                ${project.tags.map(tag => `<span class="tech-tag" style="background: rgba(138, 43, 226, 0.15); border-color: rgba(138, 43, 226, 0.4); font-size: 0.8rem;">${tag}</span>`).join('')}
            </div>

            <div style="color: var(--text-sec); line-height: 1.7; font-size: 0.95rem; margin-bottom: 1.8rem; border-top: 1px solid var(--border); padding-top: 1.2rem;">
                <h4 style="color: #fff; font-size: 1rem; letter-spacing: 1px; margin-bottom: 0.6rem; text-transform: uppercase;">Overview</h4>
                <p>${project.overview}</p>
            </div>

            <div style="color: var(--text-sec); line-height: 1.7; font-size: 0.95rem; margin-bottom: 2rem;">
                <h4 style="color: #fff; font-size: 1rem; letter-spacing: 1px; margin-bottom: 0.8rem; text-transform: uppercase;">System Architecture & Highlights</h4>
                <ul style="list-style-type: none; padding: 0; display: flex; flex-direction: column; gap: 0.8rem;">
                    ${project.architecture.map(item => `
                        <li style="display: flex; gap: 12px; align-items: flex-start;">
                            <i class="fas fa-microchip" style="color: var(--accent-primary); margin-top: 4px; font-size: 0.9rem;"></i>
                            <span>${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center; border-top: 1px solid var(--border); padding-top: 1.5rem;">
                <a href="${project.github}" target="_blank" class="btn" style="padding: 0.8rem 1.6rem; font-size: 0.9rem;">
                    <i class="fab fa-github" style="margin-right: 8px;"></i> VIEW REPOSITORY
                </a>
                <button onclick="closeProjectModal()" class="btn" style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); padding: 0.8rem 1.6rem; font-size: 0.9rem;">
                    CLOSE
                </button>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeProjectModal = function() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

window.toggleProjectCard = function(card, projectId, e) {
    if (window.isGravityOn) return;
    
    const allCards = document.querySelectorAll('.project-card');
    const isAlreadyActive = card.classList.contains('project-tapped');

    allCards.forEach(c => c.classList.remove('project-tapped'));

    if (isAlreadyActive) {
        openProjectModal(projectId);
    } else {
        card.classList.add('project-tapped');
    }
};

// Close active project cards when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card')) {
        document.querySelectorAll('.project-card').forEach(c => c.classList.remove('project-tapped'));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    createSpacePlants();
    createPlanets();
});
