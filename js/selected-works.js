const bhWrapper = document.getElementById('barnes-hut');
const bhCanvas = document.getElementById('bh-canvas'),
    bhctx = bhCanvas.getContext('2d');

const renderBH = () => {
    // bhctx.fillStyle = 'red'
    // bhctx.fillRect(0, 0, 1000, 1000);
};


const setBH = () => {
    bhCanvas.width = width;
    bhCanvas.height = height;
    // console.log(width, height);

    renderBH();
};


const sWrapper = document.getElementById('schrodinger');
const sCanvas = document.getElementById('s-canvas'),
    sctx = sCanvas.getContext('2d');

const renderS = () => {
    // sctx.fillStyle = 'blue';
    // sctx.fillRect(0, 0, 1000, 1000);
};

// Animated with GSAP
const bhPosition = {
    frame: 0,
};

const setS = () => {
    sCanvas.width = 800;
    sCanvas.height = 800;

    bhctx.drawImage(bhFrames[bhPosition.frame], (width - 800) / 2, (height - 800) / 2);

    renderS();
};

const bhFrames = [];
const loadBHFrames = () => { // Note, this leaves out the very last frame
    for (let i = 0; i < 200; i ++) {
        const img = new Image();
        img.src = `/assets/barnes-hut-frames/${i}.webp`;
        bhFrames.push(img);
    }

    // Draw first one to set it up
};

loadBHFrames();
// gsap.to('#bh-canvas', {
//     scrollTrigger: {
//         target: '#bh-canvas',
//         start: 'top top',
//         end: 'bottom bottom',
//         pin: true,
//         scrub: true,
//     }
// });
// gsap.utils.toArray('.simulation-canvas').forEach(el => {



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


const sPosition = {
    frame: 0,
};
gsap.to(sPosition, {
    frame: bhFrames.length - 1,
    snap: 'frame',
    scrollTrigger: {
        trigger: sCanvas,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        scrub: 1,
    },
    onUpdate(self) {
        sctx.drawImage(bhFrames[sPosition.frame], (width - 800) / 2, (height - 800) / 2);
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