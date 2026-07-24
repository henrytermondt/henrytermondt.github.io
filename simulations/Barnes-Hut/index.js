let ready = false;
let width, height, dim;
const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dim = 800;//Math.min(width, height);

    glCanvas.width = dim;
    glCanvas.height = dim;

    glCanvas.style.left = (width - dim) * 0.5 + 'px';
    glCanvas.style.top = (height - dim) * 0.5 + 'px';

    if (ready) renderPoints();
};
window.onresize = resize;
resize();


let paused = false;
const statusEl = document.getElementById('status');
window.onclick = e => {
    if (paused) loop();
    paused = !paused;

    statusEl.textContent = paused ? 'Paused' : 'Running';
};

let isfs = false, noPause = false;
const fsButton = document.getElementById('full-screen-button');
fsButton.onclick = e => {
    e.preventDefault();
    e.stopPropagation();

    isfs = !isfs;

    if (isfs) {
        document.body.requestFullscreen();
    } else {
        document.exitFullscreen?.();
    }
};

const zip = new JSZip();
let files = 0;
const saveImage = blob => {
    zip.file(files + '.webp', blob);
    console.log(files + '.webp');
    files ++;
};
const saveAll = () => {
    zip.generateAsync({type:"blob"}).then(function(content) {
        // console.log(content);
        const url = URL.createObjectURL(content);
        const a = document.createElement('a')
        a.href = url;
        a.download = 'images.zip';
        a.click();
        // console.log(a);
    });
};

let frame = 0;

let loop;
init().then(() => {
    initPoints();

    createRender();
    createUpdate();

    renderPoints();

    let pt = document.timeline.currentTime;
    loop = (t) => {
        reconstructPoints(pointsArr);

        constructTree();
        collapseTree(root);

        updatePoints();
        // renderPoints();

        // console.log('fps:', (1000 / (t - pt)).toFixed(4));
        // pt = t;

        // console.log(frame);
        if (frame > 200 && frame % 2 === 0) {
            renderPoints();
            glCanvas.toBlob(saveImage, 'image/webp', 0.8);
        }

        frame ++;
    };

    ready = true;

    loop();
});