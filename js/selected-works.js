const bhWrapper = document.getElementById('barnes-hut');
const bhCanvas = document.getElementById('bh-canvas'),
    bhctx = bhCanvas.getContext('2d');
const sWrapper = document.getElementById('schrodinger');
const sCanvas = document.getElementById('s-canvas'),
    sctx = sCanvas.getContext('2d');

// Animated with GSAP
const bhPosition = {
    frame: 0,
};
const sPosition = {
    frame: 0,
};


const setBH = () => {
    bhCanvas.width = width;
    bhCanvas.height = height;

    const size = width < 800 ? width : 800;

    bhctx.drawImage(bhFrames[bhPosition.frame], (width - size) / 2, (height - size) / 2, size, size);
};
const setS = () => {
    sCanvas.width = width;
    sCanvas.height = height;

    const size = width < 800 ? width : 800;

    sctx.drawImage(sFrames[sPosition.frame], (width - size) / 2, (height - size) / 2, size, size);
};

const bhFrames = [];
const loadBHFrames = () => { // Note, this leaves out the very last frame
    for (let i = 0; i < 200; i ++) {
        const img = new Image();
        img.src = `/assets/barnes-hut-frames/${i}.webp`;
        bhFrames.push(img);
    }
};
loadBHFrames();

const sFrames = [];
const loadSFrames = () => {
    for (let i = 0; i < 200; i ++) {
        const img = new Image();
        img.src = `/assets/schrodinger-frames/${i}.avif`;
        sFrames.push(img);
    }
};
loadSFrames();


gsap.to(bhPosition, {
    frame: bhFrames.length - 1,
    snap: 'frame',
    scrollTrigger: {
        trigger: bhCanvas,
        start: 'top top',
        end: 'bottom top',
        pinType: 'fixed',
        pin: true,
        scrub: 1,
    },
    onUpdate(self) {
        const size = width < 800 ? width : 800;
        bhctx.drawImage(bhFrames[bhPosition.frame], (width - size) / 2, (height - size) / 2, size, size);
    }
});
gsap.to(sPosition, {
    frame: sFrames.length - 1,
    snap: 'frame',
    scrollTrigger: {
        trigger: sCanvas,
        start: 'top top',
        end: 'bottom top',
        pinType: 'fixed',
        pin: true,
        scrub: 1,
    },
    onUpdate(self) {
        const size = width < 800 ? width : 800;
        sctx.drawImage(sFrames[sPosition.frame], (width - size) / 2, (height - size) / 2, size, size);
    }
});




const selectedWorksWrapper = document.getElementById('sw-header-wrapper');
const fadeTL = gsap.timeline({
    scrollTrigger: {
        trigger: selectedWorksWrapper,
        start: 'top top',
        toggleActions: 'restart none none reverse',
    },
    ease: 'none',
    duration: 0.3,
});
fadeTL.to(selectedWorksWrapper, {
    backgroundColor: 'black',
}, 0);
fadeTL.to('#sw-header', {
    color: 'white',
}, 0);
fadeTL.to('#sw-header-underline', {
    backgroundImage: 'linear-gradient(to right, #e1488a, #f4ab6b)',
}, 0);
fadeTL.to('#sw-color-padding-before', { // Transparent, but with starting values to make interpolation better
    backgroundImage: 'linear-gradient(#FFFFFF00, #000000 50%)',
}, 0);
fadeTL.to('#sw-color-padding', {
    backgroundImage: 'linear-gradient(#FFFFFF00 50%, #00000000 100%)',
}, 0);

