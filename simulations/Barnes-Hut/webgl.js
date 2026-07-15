const cgl = {canvas: document.createElement('canvas')};
cgl.context = cgl.canvas.getContext('webgl2', {
    powerPreference: 'high-performance',
    // antialias: false,
    alpha: false,
});
const glCanvas = cgl.canvas,
    gl = cgl.context;
ComputeShader.useContext(cgl);

// Use transparency (this is causing an issue, look into resetting?)
gl.enable(gl.BLEND);

document.body.append(glCanvas);

// From http://detectmobilebrowsers.com/
const a = navigator.userAgent||navigator.vendor||window.opera;
const isMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)));

console.log('Is mobile?', isMobile);


// Shader dimensions
let sw = 1000,
    sh = 1000,
    maxParticlesReferences = Math.sqrt(sw * sh);

if (isMobile) {
    sw = 300;
    sh = 200;
    maxParticlesReferences = Math.sqrt(sw * sh)
}

const pointsArr = new Float32Array(sw * sh * 4);
const initPoints = () => {
    const split = 0.75;

    for (let i = 0; i < sw * sh * 4 * split; i += 4) {
        const angle = Math.random() * Math.PI * 2,
            dist = Math.tan(1.5 * Math.random());
        const x = Math.cos(angle) * 0.15 * dist + 0.4,//Math.random() * 0.5 + 0.25,
            y = Math.sin(angle) * 0.15 * dist + 0.6,//Math.random() * 0.5 + 0.25,
            vx = Math.cos(angle + Math.PI / 2) * (1 - dist * 0.5) * 0.0008 * Math.random(),
            vy = Math.sin(angle + Math.PI / 2) * (1 - dist * 0.5) * 0.0008 * Math.random();
        pointsArr[i    ] = x;
        pointsArr[i + 1] = y;
        pointsArr[i + 2] = vx;
        pointsArr[i + 3] = vy - 0.0002;
    }

    for (let i = sw * sh * 4 * split; i < sw * sh * 4; i += 4) {
        const angle = Math.random() * Math.PI * 2,
            dist = Math.tan(1.5 * Math.random());
        const x = Math.cos(angle) * 0.1 * dist + 0.7,//Math.random() * 0.5 + 0.25,
            y = Math.sin(angle) * 0.1 * dist + 0.3,//Math.random() * 0.5 + 0.25,
            vx = Math.cos(angle + Math.PI / 2) * (1 - dist) * 0.0008 * Math.random(),
            vy = Math.sin(angle + Math.PI / 2) * (1 - dist) * 0.0008 * Math.random();
        pointsArr[i    ] = x;
        pointsArr[i + 1] = y;
        pointsArr[i + 2] = vx;
        pointsArr[i + 3] = vy + 0.0006;
    }

    for (let i = 0; i < sw * sh; i ++) {
        if (points.length < maxParticlesReferences) {

            const ai = (Math.random() * sw * sh | 0) * 4;
            points.push(
                new Point(i,
                    pointsArr[ai    ],
                    pointsArr[ai + 1],
                    pointsArr[ai + 2],
                    pointsArr[ai + 3],
                )
            );
        }
    }
    
    
    pointsInput.update(pointsArr);
};



let pointsInput,
    treeInput;


let pvs, pfs; // Point shader sources
let updatecs;
const init = () => { // Fetch the shader sources and created the shaders
    return Promise.all([
        fetch('./shaders/update.glsl').then(r => r.text()).then(source => {
            pointsInput = new ComputeShaderInput('points', pointsArr, sw, sh),
            treeInput = new ComputeShaderInput('tree', treeArr, tw, th);
            
            updatecs = new ComputeShader(source, sw, sh);
            updatecs.addInput(pointsInput);
            updatecs.addInput(treeInput);
        }),
        fetch('./shaders/render-vs.glsl').then(r => r.text()).then(source => {
            pvs = ComputeShader.createShader(gl, gl.VERTEX_SHADER, source);
        }),
        fetch('./shaders/render-fs.glsl').then(r => r.text()).then(source => {
            pfs = ComputeShader.createShader(gl, gl.FRAGMENT_SHADER, source);
        }),
    ]);
};



let updatePoints, renderPoints;

const createUpdate = () => {
    // const pbo = gl.createBuffer();

    // gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
    // gl.bufferData(gl.PIXEL_UNPACK_BUFFER, treeArr.byteLength, gl.DYNAMIC_DRAW);
    // gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);


    updatePoints = () => {

        gl.blendFunc(gl.ONE, gl.ZERO);

        updatecs.use();
        

        // gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
        // gl.bufferSubData(gl.PIXEL_UNPACK_BUFFER, 0, treeArr);

        gl.bindTexture(gl.TEXTURE_2D, treeInput.texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA32F,
            treeInput.width,
            treeInput.height,
            0,
            gl.RGBA,
            gl.FLOAT,
            treeArr//0
        );
        // gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);

        updatecs.initializeInputs();
        updatecs.run();
        updatecs.readAsync(pointsArr).then(() => {
            if (!paused) {
                window.requestAnimationFrame(loop);
            }
        });
        ComputeShader.swap(pointsInput, updatecs.output);
    };
};
const createRender = () => {
    const idAttrib = 10;
    const pointsProgram = (() => {
        const program = gl.createProgram();
        gl.attachShader(program, pvs);
        gl.attachShader(program, pfs);

        gl.bindAttribLocation(program, idAttrib, 'id');

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new ComputeShaderError('An error occured in a program: ' + gl.getProgramInfoLog(program));
        }

        return program;
    })();

    gl.useProgram(pointsProgram);
    
    const numPoints = sw * sh,
        pointIds = new Float32Array(numPoints);
    for (let i = 0; i < numPoints; i ++) pointIds[i] = i;

    gl.enableVertexAttribArray(idAttrib);

    const idBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointIds, gl.STATIC_DRAW);

    gl.vertexAttribPointer(idAttrib, 1, gl.FLOAT, false, 0, 0);

    const pointsUniform = gl.getUniformLocation(pointsProgram, 'points'),
        pointsDimUniform = gl.getUniformLocation(pointsProgram, 'pointsDim');

    gl.disableVertexAttribArray(idAttrib);

    renderPoints = () => {
        gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);
        gl.enableVertexAttribArray(idAttrib);
        gl.vertexAttribPointer(idAttrib, 1, gl.FLOAT, false, 0, 0);
        
        gl.useProgram(pointsProgram);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.uniform1i(pointsUniform, 0);
        gl.uniform2fv(pointsDimUniform, [sw, sh]);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pointsInput.texture);

        gl.viewport(0, 0, dim, dim);
        gl.drawArrays(gl.POINTS, 0, numPoints);
        
        gl.disableVertexAttribArray(idAttrib);
    };
};
