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

    bhctx.drawImage(bhFrames[bhPosition.frame], (width - 800) / 2, (height - 800) / 2);
};
const setS = () => {
    sCanvas.width = width;
    sCanvas.height = height;

    sctx.drawImage(sFrames[sPosition.frame], (width - 800) / 2, (height - 800) / 2);
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
        pin: true,
        scrub: 1,
    },
    onUpdate(self) {
        bhctx.drawImage(bhFrames[bhPosition.frame], (width - 800) / 2, (height - 800) / 2);
    }
});


gsap.to(sPosition, {
    frame: sFrames.length - 1,
    snap: 'frame',
    scrollTrigger: {
        trigger: sCanvas,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        scrub: 1,
    },
    onUpdate(self) {
        sctx.drawImage(sFrames[sPosition.frame], (width - 800) / 2, (height - 800) / 2);
    }
});


    // ScrollTrigger.create({
    //     trigger: el,
    //     start: 'top',
    //     end: 'bottom',
    //     pin: true,
    //     anticipatePinning: true,
    //     // scrub: 10,
    //     // onUpdate(self) {
    //     //     let frame = self.progress * (bhFrames.length - 1) | 0;

    //     //     bhctx.drawImage(bhFrames[frame], (width - 800) / 2, (height - 800) / 2);
    //     // }
    // });
// });

// ScrollTrigger.create({
//     trigger: sCanvas,
//     start: 'top',
//     end: 'bottom',
//     pin: true,
//     anticipatePinning: true,
//     scrub: true,
//     onUpdate(self) {
//         console.log(self.progress);
//     }
// });