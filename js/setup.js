let width = window.innerWidth,
    height = window.innerHeight;

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SlowMo);



const offscreenCanvas = new OffscreenCanvas(width, height)
    octx = offscreenCanvas.getContext('2d');

const heroAspectRatio = 13/6.9,//1.529,
    penroseAspectRatio = 0.785;

const resumeButtons = document.querySelectorAll('.resume-button');

const containers = document.querySelectorAll('.container');
const right = document.getElementById('right');
const title = document.getElementById('title'),
    titleScale = 8.35;
const penroseHero = document.getElementById('penrose-hero'),
    penroseAccent = document.getElementById('penrose-accent');
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
const loadAnimation = gsap.fromTo('.l-box', {y: 100}, {
    y: -100,
    stagger: 0.2,
    repeat: -1,
    ease: 'slow(0.01, 1, false)',
    duration: 1,
    onRepeat() {
        if (revealed) return;

        const override = (document.readyState === 'interactive' && ++repeats >= 2);
        if (override) {
            revealMinimal();
            return;
        }

        if (sessionStorage.getItem('fullLoadAnimation') === 'done') return;

        if (document.readyState === 'complete' || override) {
            revealAll();
        }
    },
})


window.addEventListener('DOMContentLoaded', e => {
    document.getElementById('l-boxes').style.display = 'flex';
})

window.addEventListener('load', e => {
    if (revealed) return;
    console.log('loaded');

    console.log('in load', window.scrollY);
    if (sessionStorage.getItem('fullLoadAnimation') === 'done' || (document.readyState === 'interactive' && repeats >= 2)) {
        console.log('hi');
        revealMinimal();
    }
});

window.onbeforeunload = e => {
    sessionStorage.setItem('scrollY', window.scrollY);
};