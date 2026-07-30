// 10, 28, 8/3
const sigma = 10,
    ro = 30,
    beta = 8/3;

let dt = 0.005;

const maxVerts = 400;


const glCanvas = document.getElementById('canvas'),
    gl = glCanvas.getContext('webgl', {alpha: true, premultipliedAlpha: false});

// Draw transparency
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

glCanvas.width = window.innerWidth;
glCanvas.height = window.innerHeight;

window.onresize = () => {
    glCanvas.width = window.innerWidth;
    glCanvas.height = window.innerHeight;

    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
};

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
    }

    return shader;
}
function createProgram(gl, vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    return program;
}

const zeroVec = vec3.fromValues(0, 0, 0),
    upVec = vec3.fromValues(0, 1, 0);
const cam = {
    rotOrigin: vec3.fromValues(0, 0, 30),
    rotSpeed: 0.001,
    pos: vec3.fromValues(-90, 12, 12),
    rotX: 0.13,
    rotY: 1.36,
    up: upVec,
    setView() {
        this.rotY += this.rotSpeed;
        vec3.rotateY(this.pos, this.pos, this.rotOrigin, this.rotSpeed);
    }
};