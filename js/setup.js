let width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight;
let smallMargin = width < 500 ? 12 : 25,
    largeMargin = width < 500 ? 25 : 50;

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SlowMo);
gsap.registerPlugin(SplitText);


const penroseHero = document.getElementById('penrose-hero'),
    penroseAccent = document.getElementById('penrose-accent');

let ts;
const setHero = () => {
    console.log(width, width / heroAspectRatio, height, height * heroAspectRatio);
    let containerWidth = width / heroAspectRatio < height ? width : height * heroAspectRatio;
    for (const container of containers) {
        container.style.width = containerWidth + 'px';
        container.style.left = (width - containerWidth) * 0.5 + 'px';
    }

    if (width >= 1000) {
        penroseHero.style.display = 'block';
        const penroseWidth = containerWidth * 5 / 13;

        const titleSize = (containerWidth - penroseWidth - largeMargin - (smallMargin + 5) * 2) / titleScale;
        ts = titleSize + 'px';

        document.documentElement.style.setProperty('--ts', ts);

        // Penrose positioning
        penroseHero.style.width = penroseWidth + 'px';
        penroseAccent.style.height = penroseWidth * 0.3 + 'px';
        penroseAccent.style.transform = `translateY(${penroseWidth * 0.25}px)`;
    } else {
        penroseHero.style.display = 'none';

        console.log(largeMargin, smallMargin);
        const titleSize = (containerWidth - largeMargin - (smallMargin + 20) * 2) / titleScale;
        ts = titleSize + 'px';

        document.documentElement.style.setProperty('--ts', ts);

        penroseAccent.style.height = titleSize * 4.7 * 0.35  + 'px';
        // penroseAccent.style.transform = `translateY(${titleSize * 1.3}px)`;
    }
};

const about = document.getElementById('about');
const aboutLeft = document.getElementById('about-left');
const lorenzIframe = document.getElementById('lorenz-attractor'),
    lorenzAnchor = document.getElementById('lorenz-anchor');

// Handles disabling/enabling Lorenz Attractor
const lorenzObserver = new IntersectionObserver(entries => {
    lorenzIframe.contentWindow.postMessage(entries[0].isIntersecting ? 'play' : 'pause');
}, {threshold: 0});

const setLorenz = () => {
    const referenceHeight = window.getComputedStyle(aboutLeft).height;
    lorenzIframe.style.height = lorenzAnchor.style.height = referenceHeight;
    lorenzIframe.style.display = 'block';

    if (width <= 1000) {
        lorenzAnchor.style.height = +referenceHeight.slice(0, -2) * 0.8 + 'px';
    }
    if (width <= 500) {
        lorenzAnchor.style.height = +referenceHeight.slice(0, -2) * 0.5 + 'px';
    }
};

const resize = () => {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;

    smallMargin = width < 500 ? 12 : 25;
    largeMargin = width < 500 ? 25 : 50;

    fullSlideWidth = 350 + 100 + 20;
    if (width - (largeMargin) * 2 < 350) 
        fullSlideWidth = width - 10 * 2 + largeMargin; //calc(100vw - var(--large-margin) * 2), 350px);
    
    // console.log();

    setHero();
    setLorenz();
    lorenzIframe.contentWindow.postMessage('resize');

    setBH();
    setS();

    ScrollTrigger.refresh();

    selectFirstInfoCard();

    document.getElementById('about-separate').style.height = window.getComputedStyle(aboutLeft).height;
};







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
            loadAnimation?.pause?.();
        },
    });

    const scrollY = sessionStorage.getItem('scrollY');
    if (scrollY !== null) window.scrollTo(0, +scrollY);
    // else gsap.set('nav', {y: -48});

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
    if (sessionStorage.getItem('fullLoadAnimation') !== 'done') {
        loadAnimation = gsap.fromTo('.l-box', {y: 100}, {
            y: -100,
            stagger: 0.2,
            repeat: -1,
            ease: 'slow(0.01, 1, false)',
            duration: 1,
            onRepeat() {
                if (revealed) return;

                if (revealReady) {
                    revealAll();
                }
            },
        })
    } else {
        gsap.set('.l-box', {opacity: 0});
    }
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
        resize();
        resolve();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            resize();
            resolve();
        });
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






gsap.utils.toArray('.resume-button').forEach(el => {
    el.onmouseenter = () => {
        gsap.to(el, {
            backgroundImage: 'linear-gradient(134deg, #1fbd78, #0b5394)',
            duration: 0.2,
        });

        gsap.to(el.firstElementChild, {
            backgroundImage: 'linear-gradient(134deg, #FFFFFF, #FFFFFF)',
            duration: 0.2,
        });
    };
    el.onmouseleave = () => {
        gsap.to(el, {
            backgroundImage: 'linear-gradient(134deg, #FFFFFF00, #FFFFFF00)',
            duration: 0.2,
        });
        gsap.to(el.firstElementChild, {
            backgroundImage: 'linear-gradient(134deg, #1fbd78, #0b5394)',
            duration: 0.2,
        });
    }
});




window.setTimeout(() => {
    // for (const el of document.querySelectorAll('*')) {
    //     const style = getComputedStyle(el)
    //     if (+style.width.slice(0, -2) + +style.left.slice(0, -2) >= 998)
    //         console.log(+style.width.slice(0, -2) + +style.left.slice(0, -2), el);
    // }
    console.log(getComputedStyle(lorenzIframe).width, getComputedStyle(lorenzIframe).left);
}, 2000);