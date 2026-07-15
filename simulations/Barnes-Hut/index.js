let ready = false;
let width, height, dim;
const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dim = Math.min(width, height);

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


let loop;
init().then(() => {
    initPoints();

    createRender();
    createUpdate();

    renderPoints();

    loop = () => {
        reconstructPoints(pointsArr);

        constructTree();
        collapseTree(root);

        updatePoints();
        renderPoints();
    };

    ready = true;

    loop();
});