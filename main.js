// Intersection Observer for animations
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

// Smooth scrolling
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
                // FormSubmit requires the FIRST submission to be non-AJAX to activate the email
                contactForm.submit(); 
            }
        })
        .catch(error => {
            // Fallback if CORS blocks the unauthorized AJAX ping before activation
            console.log("AJAX failed (likely needs activation). Falling back to standard submit...");
            contactForm.submit();
        });
    });
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(5, 5, 5, 0.8)';
        nav.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.05)';
        nav.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    }
});

// Certification Lightbox Gallery
let currentCertIndex = 0;
const certCards = document.querySelectorAll('.cert-card');
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');

window.openCertModal = function(index) {
    if (window.isGravityOn) return; // Google Space: Click doesn't zoom/modal
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

// Close modal on outside click
if(certModal) {
    certModal.addEventListener('click', function(e) {
        if(e.target === certModal) {
            closeCertModal();
        }
    });
}

// 5. Comet Trail Cursor Effect
const cursorParticles = [];
const particleCount = 20;

function createCursorParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    // Random velocity
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
    // Throttle DOM creation for buttery smooth performance
    if (Math.random() > 0.85) {
        createCursorParticle(e.clientX, e.clientY);
    }
});

updateCursorParticles();

// ----------------------------------------------------
// Space Theme Enhancements
// ----------------------------------------------------

// Legacy cosmos canvas removed - milkyway.js handles background now.// 2. Parallax Interaction for Layers
const layers = document.querySelectorAll(".cosmos-layer");
let centerX = width / 2;
let centerY = height / 2;

window.addEventListener("mousemove", (e) => {
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

    // 2.1 Plant Interaction
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
});

// 3. Cosmic Sound Effects (Web Audio API)
let audioCtx;
const sounds = {};

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Ambient Space Hum
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(50, audioCtx.currentTime); // Low hum
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); // Very quiet
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
}

function playSpaceSound(freq, type = 'sine', duration = 0.1, volume = 0.05) {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
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
}

// Initialize on first interaction
document.addEventListener('click', () => {
    if (!audioCtx) initAudio();
}, { once: true });

// Add hover sounds to elements
function addHoverSounds() {
    const hoverables = document.querySelectorAll("a, .btn, .contact-link-card, .cert-img-wrapper, .card");
    hoverables.forEach(el => {
        el.addEventListener("mouseenter", () => {
            playSpaceSound(440, 'triangle', 0.15, 0.03);
            if (cursor) cursor.classList.add("grow");
        });
        el.addEventListener("mouseleave", () => {
            if (cursor) cursor.classList.remove("grow");
        });
        el.addEventListener("click", () => {
            playSpaceSound(880, 'sine', 0.2, 0.05);
        });
    });
}

// 6. Space Plant / Organic Flora Generation
function createSpacePlants() {
    const starfield = document.querySelector('.cosmos-bg');
    if (!starfield) return;
    const plantCount = 15;
    const leafPaths = [
        "M10,50 Q25,0 50,50 T90,50", // Simple leaf
        "M50,100 Q0,50 50,0 Q100,50 50,100", // Seed/Petal
        "M10,90 Q50,0 90,90 Z" // Triangular leaf
    ];

    for (let i = 0; i < plantCount; i++) {
        const plant = document.createElement('div');
        plant.className = 'space-plant';
        
        const size = Math.random() * 60 + 40;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * -20;
        const path = leafPaths[Math.floor(Math.random() * leafPaths.length)];
        
        plant.style.left = `${x}%`;
        plant.style.top = `${y}%`;
        plant.style.width = `${size}px`;
        plant.style.height = `${size}px`;
        plant.style.setProperty('--sway-duration', `${duration}s`);
        plant.style.animationDelay = `${delay}s`;
        
        // Random cosmic color
        const color = Math.random() > 0.5 ? 'var(--accent-primary)' : 'var(--accent-sec)';
        
        plant.innerHTML = `
            <svg viewBox="0 0 100 100" style="width:100%; height:100%; fill:${color}; overflow:visible;">
                <path d="${path}" />
            </svg>
        `;
        
        starfield.appendChild(plant);
    }
}

// 7. 2D Planets Generation
function createPlanets() {
    const starfield = document.querySelector('.cosmos-bg');
    if (!starfield) return;

    const planetsData = [
        { name: 'mercury', label: 'Mercury', top: 15, left: 10, depth: 40 },
        { name: 'venus', label: 'Venus', top: 25, left: 85, depth: 30 },
        { name: 'earth', label: 'Earth', top: 45, left: 15, depth: 25 },
        { name: 'mars', label: 'Mars', top: 65, left: 80, depth: 35 },
        { name: 'jupiter', label: 'Jupiter', top: 110, left: 75, depth: 20 }, // Near Technical Expertise
        { name: 'saturn', label: 'Saturn', top: 140, left: 10, depth: 15 },
        { name: 'uranus', label: 'Uranus', top: 170, left: 85, depth: 25 },
        { name: 'neptune', label: 'Neptune', top: 195, left: 20, depth: 30 }
    ];

    planetsData.forEach(data => {
        const planet = document.createElement('div');
        planet.className = `planet ${data.name} planet-pulse`;
        planet.style.top = `${data.top}%`;
        planet.style.left = `${data.left}%`;
        
        // Custom attribute for parallax depth
        planet.setAttribute('data-depth', data.depth);

        const label = document.createElement('span');
        label.className = 'planet-label';
        label.innerText = data.label;
        
        planet.appendChild(label);
        starfield.appendChild(planet);
        
        // Interactive Click Effect
        planet.addEventListener('click', () => {
            playSpaceSound(660, 'sine', 0.4, 0.08);
            planet.style.transform = 'scale(2) rotate(360deg)';
            setTimeout(() => {
                planet.style.transform = '';
            }, 1000);
        });
    });
}

// Update parallax logic to include planets
// Update parallax logic to include planets and plants
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

    // Parallax for Planets
    const planets = document.querySelectorAll(".planet");
    planets.forEach(planet => {
        const depth = parseFloat(planet.getAttribute('data-depth')) || 20;
        const translateX = -dx * depth;
        const translateY = -dy * depth;
        planet.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });

    // Plant Interaction (Mouse Avoidance)
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

    // Cursor Follow
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

// 4. Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // drawStars removed
    createSpacePlants();
    createPlanets();
    // addHoverSounds removed
    initGravity(); // Added here
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

// Vanilla Tilt
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.1,
        scale: 1.02
    });
}

// 8. Global Gravity Simulation (Google Space Style)
