/**
 * THREE.JS 3D INTERACTIVE ORANGE & WHITE PLANET ENGINE
 * Features:
 *  - Removed purple torus knot & blue crystal wireframe meshes.
 *  - Interactive 3D Orange & White Planet Sphere with atmosphere halo and ring system.
 *  - Reduced star particle count for a clean, elegant background.
 *  - Camera scroll trajectory and mouse parallax interactivity.
 */

(function () {
    let scene, camera, renderer;
    let orangePlanet, planetAura, planetRing, particleSystem;
    let pointLight1, pointLight2;
    let particlePositions;
    const PARTICLE_COUNT = 350;

    let targetScrollY = 0;
    let currentScrollY = 0;
    let scrollVelocity = 0;
    let lastScrollY = 0;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    function init() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;

        // 1. Scene Setup
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050510, 0.0015);

        // 2. Camera Setup
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 90);

        // 3. Renderer Setup
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 4. Create Interactive 3D Orange & White Planet
        createPlanetScene();

        // 5. Lighting Setup
        createLighting();

        // 6. Event Listeners
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // 7. Start Render Loop
        animate();
    }

    function makePlanetTextures(size = 1024) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size / 2;
        const ctx = canvas.getContext('2d');

        // Base rust-orange gradient (poles lighter/frostier, equator deeper orange-red)
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#fde047');   // North polar cap tint
        grad.addColorStop(0.12, '#f97316');
        grad.addColorStop(0.5, '#ea580c');
        grad.addColorStop(0.88, '#c2410c');
        grad.addColorStop(1, '#fde047');   // South polar cap tint
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Blotchy surface variation (9000 micro-variations)
        for (let i = 0; i < 9000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const r = Math.random() * 10 + 1;
            const shade = Math.random();
            let color;
            if (shade < 0.5) color = `rgba(90,35,15,${Math.random() * 0.25})`;
            else if (shade < 0.85) color = `rgba(190,110,70,${Math.random() * 0.2})`;
            else color = `rgba(220,190,160,${Math.random() * 0.15})`;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Craters (140 procedural impact craters)
        for (let i = 0; i < 140; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const r = Math.random() * 14 + 3;
            const crater = ctx.createRadialGradient(x, y, 0, x, y, r);
            crater.addColorStop(0, 'rgba(40,15,5,0.55)');
            crater.addColorStop(0.6, 'rgba(40,15,5,0.25)');
            crater.addColorStop(1, 'rgba(40,15,5,0)');
            ctx.fillStyle = crater;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Polar Ice Caps (solid whitish caps)
        ctx.fillStyle = 'rgba(255,255,240,0.85)';
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, 8, canvas.width / 2, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height - 8, canvas.width / 2, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        const colorTex = new THREE.CanvasTexture(canvas);
        colorTex.wrapS = THREE.RepeatWrapping;

        // Bump map: grayscale version of the same blotch/crater pattern
        const bumpCanvas = document.createElement('canvas');
        bumpCanvas.width = canvas.width; 
        bumpCanvas.height = canvas.height;
        const bctx = bumpCanvas.getContext('2d');
        bctx.drawImage(canvas, 0, 0);
        const imgData = bctx.getImageData(0, 0, bumpCanvas.width, bumpCanvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
            const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
            imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = avg;
        }
        bctx.putImageData(imgData, 0, 0);
        const bumpTex = new THREE.CanvasTexture(bumpCanvas);

        return { colorTex, bumpTex, canvas };
    }

    function createPlanetScene() {
        // --- 1. Interactive 3D Planet Sphere with Procedural Texture & Bump Map ---
        const planetGeo = new THREE.SphereGeometry(24, 96, 96);
        const { colorTex, bumpTex } = makePlanetTextures();

        const planetMat = new THREE.MeshStandardMaterial({
            map: colorTex,
            bumpMap: bumpTex,
            bumpScale: 0.045,
            color: 0xffa500,
            emissive: 0x882200,
            emissiveIntensity: 0.25,
            roughness: 0.8,
            metalness: 0.05
        });

        orangePlanet = new THREE.Mesh(planetGeo, planetMat);
        orangePlanet.position.set(28, -5, -35);
        scene.add(orangePlanet);

        // --- 2. Thin Atmospheric Glow Shader ---
        const glowGeo = new THREE.SphereGeometry(25.2, 64, 64);
        const glowMat = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.BackSide,
            uniforms: {},
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
                    gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0) * intensity;
                }
            `
        });
        planetAura = new THREE.Mesh(glowGeo, glowMat);
        orangePlanet.add(planetAura);

        // --- 3. Cosmic Orbital Ring ---
        const ringGeo = new THREE.RingGeometry(32, 45, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xffbe76,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        planetRing = new THREE.Mesh(ringGeo, ringMat);
        planetRing.rotation.x = Math.PI / 2.3;
        orangePlanet.add(planetRing);

        // --- 4. Clean Subtle Star Particles ---
        const particlesGeo = new THREE.BufferGeometry();
        particlePositions = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 220;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 220;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 250;
        }

        particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleCanvas = document.createElement('canvas');
        particleCanvas.width = 16;
        particleCanvas.height = 16;
        const pCtx = particleCanvas.getContext('2d');
        const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        pGrad.addColorStop(0.5, 'rgba(255, 184, 48, 0.5)');
        pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        pCtx.fillStyle = pGrad;
        pCtx.fillRect(0, 0, 16, 16);

        const particleTexture = new THREE.CanvasTexture(particleCanvas);

        const particlesMat = new THREE.PointsMaterial({
            size: 1.1,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.65
        });

        particleSystem = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particleSystem);
    }

    function createLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Direct sunlight shining on the Orange/White Planet
        const directionalLight = new THREE.DirectionalLight(0xfffaed, 2.0);
        directionalLight.position.set(-50, 30, 60);
        scene.add(directionalLight);

        pointLight1 = new THREE.PointLight(0xff9800, 3.0, 300);
        pointLight1.position.set(30, 20, 40);
        scene.add(pointLight1);

        pointLight2 = new THREE.PointLight(0xffffff, 2.0, 300);
        pointLight2.position.set(-30, -20, 40);
        scene.add(pointLight2);
    }

    function onScroll() {
        targetScrollY = window.scrollY;
        const delta = targetScrollY - lastScrollY;
        scrollVelocity += (delta - scrollVelocity) * 0.4;
        lastScrollY = targetScrollY;
    }

    function onMouseMove(e) {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        // --- Smooth Interpolations ---
        currentScrollY += (targetScrollY - currentScrollY) * 0.08;
        scrollVelocity *= 0.88;

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollFraction = currentScrollY / maxScroll;

        // --- 1. Camera Trajectory ---
        camera.position.z = 90 - scrollFraction * 20;
        camera.position.y = -scrollFraction * 45 + mouseY * 4;
        camera.position.x = mouseX * 6;

        const targetFov = 60 + Math.min(12, Math.abs(scrollVelocity) * 0.12);
        camera.fov += (targetFov - camera.fov) * 0.1;
        camera.updateProjectionMatrix();

        camera.lookAt(0, -scrollFraction * 45, 0);

        // --- 2. Interactive Orange & White Planet Rotation & Orbit ---
        const time = Date.now() * 0.0006;

        if (orangePlanet) {
            orangePlanet.rotation.y = scrollFraction * Math.PI * 2.5 + time * 0.4;
            orangePlanet.rotation.x = mouseY * 0.25 + scrollFraction * 0.4;
            orangePlanet.rotation.z = mouseX * 0.15;
            orangePlanet.position.y = -5 - scrollFraction * 45 + Math.sin(time) * 3;
            orangePlanet.position.x = 28 + mouseX * 4;
        }

        if (planetRing) {
            planetRing.rotation.z += 0.0018 + Math.abs(scrollVelocity) * 0.0002;
        }

        // --- 3. Subtle Floating Star Particle Drift ---
        if (particleSystem) {
            particleSystem.rotation.y = currentScrollY * 0.00015;
        }

        // --- 4. Dynamic Lighting Parallax ---
        if (pointLight1 && pointLight2) {
            pointLight1.position.x = Math.sin(time) * 40 + mouseX * 15;
            pointLight1.position.y = -scrollFraction * 45;
            pointLight2.position.x = -Math.sin(time) * 40 + mouseX * 15;
            pointLight2.position.y = -scrollFraction * 45;
        }

        renderer.render(scene, camera);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
