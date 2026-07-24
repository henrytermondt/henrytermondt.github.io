/* 
Note: The magic numbers in the code don't have any hidden mathematical meaning;
they simply represent what I thought looked best


*/

// const lenis = new Lenis();
// lenis.on('scroll', ScrollTrigger.update);
// gsap.ticker.add((time) => {
//   lenis.raf(time * 1000); 
// });
// gsap.ticker.lagSmoothing(0);



const heroAspectRatio = 13/6.9,//1.529,
    penroseAspectRatio = 0.785;



const offscreenCanvas = new OffscreenCanvas(width, height)
    octx = offscreenCanvas.getContext('2d');

const resumeButtons = document.querySelectorAll('.resume-button');

const container = document.getElementById('container');
const right = document.getElementById('right');
const title = document.getElementById('title'),
    titleScale = 8.35;
const penroseHero = document.getElementById('penrose-hero'),
    penroseAccent = document.getElementById('penrose-accent');
const descriptionHero = document.getElementById('description');
const setHero = () => {
    let containerWidth = width / heroAspectRatio < height ? width : height * heroAspectRatio;
    container.style.width = containerWidth + 'px';
    container.style.left = (width - containerWidth) * 0.5 + 'px';

    const penroseWidth = containerWidth * 5 / 13;

    const titleSize = (containerWidth - penroseWidth - 50 - 30 * 2) / titleScale;
    // title.style.fontSize = titleSize + 'px';

    document.documentElement.style.setProperty('--ts', titleSize + 'px');

    // Penrose positioning
    penroseHero.style.width = penroseWidth + 'px';
    penroseAccent.style.height = penroseWidth * 0.3 + 'px';
    penroseAccent.style.transform = `translateY(${penroseWidth * 0.25}px)`;

    // Setting font sizes
    // descriptionHero.style.fontSize = titleSize * 0.28 + 'px';
    // for (const b of resumeButtons) {
    //     b.style.fontSize = titleSize * 0.37 + 'px';
    // }
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
};

const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    setHero();
    setLorenz();
    lorenzIframe.contentWindow.postMessage('resize');

    setBH();
    setS();

    ScrollTrigger.refresh();

    document.getElementById('about-separate').style.height = window.getComputedStyle(aboutLeft).height;
};

const loadSimulations = () => {
    
    // lorenzIframe.contentWindow.postMessage('play');
};
window.onmessage = message => {
    if (message.source === lorenzIframe.contentWindow && message.data === 'ready') {
        setLorenz();
        lorenzObserver.observe(lorenzIframe);
    }
}

window.onresize = resize;

window.onload = () => {
    resize();
    loadSimulations();
};

// for (let i = 0; i < 4; i ++) {
//     window.setTimeout(async () => {
//         const pr = window.scrollTo(0, document.body.scrollHeight);
//         // console.log(pr);
//         // console.log(await pr);
//         console.log('did it work?', i)
//     }, 100 + i * 200)
// }