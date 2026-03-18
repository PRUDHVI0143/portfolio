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
        if(img) modalImg.src = img.src;
        if(title) modalCaption.innerText = title.innerText;
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

// ----------------------------------------------------
// Professional Interactivity Upgrades
// ----------------------------------------------------

// 1. Custom Interactive Cursor
const cursor = document.getElementById("cursor");
const cursorBlur = document.getElementById("cursor-blur");

window.addEventListener("mousemove", (e) => {
    if(cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    }
    if(cursorBlur) {
        // Subtle delay for the glow effect
        setTimeout(() => {
            cursorBlur.style.left = e.clientX + "px";
            cursorBlur.style.top = e.clientY + "px";
        }, 80);
    }
});

// Cursor expansion on hoverable elements
const hoverables = document.querySelectorAll("a, .btn, .contact-link-card, .cert-img-wrapper, .modal-nav");
hoverables.forEach(el => {
    el.addEventListener("mouseenter", () => cursor && cursor.classList.add("grow"));
    el.addEventListener("mouseleave", () => cursor && cursor.classList.remove("grow"));
});

// 2. Scroll Progress Bar Update
const scrollProgress = document.getElementById("scroll-progress");

window.addEventListener('scroll', () => {
    if(scrollProgress) {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
        scrollProgress.style.width = scrolled;
    }
});

// 3. Initialize 3D Glassmorphism Tilt Effect on all cards
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.05,
        scale: 1.01
    });
}
