let width = window.innerWidth,
    height = window.innerHeight;

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SlowMo);


const penroseHero = document.getElementById('penrose-hero'),
    penroseAccent = document.getElementById('penrose-accent');







const offscreenCanvas = new OffscreenCanvas(width, height)
    octx = offscreenCanvas.getContext('2d');

const heroAspectRatio = 13/6.9,//1.529,
    penroseAspectRatio = 0.785;

const resumeButtons = document.querySelectorAll('.resume-button');

const containers = document.querySelectorAll('.container');
const right = document.getElementById('right');
const title = document.getElementById('title'),
    titleScale = 8.35;
const descriptionHero = document.getElementById('description');

const loading = document.getElementById('loading');

let revealed = false;
const revealMinimal = () => {
    gsap.to(title, {
        opacity: 1,
        ease: 'linear',
        duration: 0.2,
    });
    gsap.to(loading, {
        opacity: 0,
        ease: 'linear',
        duration: 0.2,
        onStart: () => {
            document.body.style.overflowY = 'auto';
            loading.style.pointerEvents = 'none';
        },
        onComplete: () => {
            loadAnimation.pause();
        },
    });

    const scrollY = sessionStorage.getItem('scrollY');
    if (scrollY !== null) window.scrollTo(0, +scrollY);

    revealed = true;
};
const revealAll = () => {
    loadAnimation.pause();

    gsap.to(title, {
        opacity: 1,
        ease: 'linear',
        delay: 0.0,
        duration: 0.6,
    });
    gsap.from(title, {
        y: 15,
        delay: 0.0,
        duration: 0.4,
        ease: 'circ.out',
    });
    gsap.to(loading, {
        opacity: 0,
        ease: 'linear',
        delay: 0.7,
        duration: 0.6,
        onStart: () => {
            document.body.style.overflowY = 'auto';
            loading.style.pointerEvents = 'none';
        },
    });

    sessionStorage.setItem('fullLoadAnimation', 'done');

    revealed = true;
};

let repeats = 0;
let loadAnimation = null;
window.addEventListener('DOMContentLoaded', e => {
    document.getElementById('l-boxes').style.display = 'flex';
    loadAnimation = gsap.fromTo('.l-box', {y: 100}, {
        y: -100,
        stagger: 0.2,
        repeat: -1,
        ease: 'slow(0.01, 1, false)',
        duration: 1,
        onRepeat() {
            console.log('what');
            if (revealed) return;

            if (revealReady) {
                revealAll();
            }
        },
    })
})



const penroseImg = new Image();
const penroseReady = new Promise((resolve, reject) => {
    penroseImg.onload = () => {
        penroseHero.style.backgroundImage = 'url("/assets/penrose-variant.avif")';
        resolve();
    };
    penroseImg.onerror = () => {
        reject();
    };

    penroseImg.src = '/assets/penrose-variant.avif';
});

const documentReady = new Promise((resolve) => {
    if (document.readyState === 'interactive') {
        resolve();
    } else {
        window.addEventListener('DOMContentLoaded', resolve);
    }
});

// If the penrose image is loaded, the DOM is ready, and the fonts are loaded, then display 
let revealReady = false;
Promise.all([penroseReady, documentReady, document.fonts.ready]).then((resolve, reject) => {
    if (sessionStorage.getItem('fullLoadAnimation') === 'done') revealMinimal();
    else revealReady = true;
});


window.onbeforeunload = e => {
    sessionStorage.setItem('scrollY', window.scrollY);
};