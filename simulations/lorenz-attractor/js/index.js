const main = async () => {
    const vertexSource = await (await fetch('./scripts/vertex-shader.glsl')).text(),
        fragmentSource = await (await fetch('./scripts/fragment-shader.glsl')).text();
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource),
        fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource),
        program = createProgram(gl, vertexShader, fragmentShader);
    
    gl.useProgram(program);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    const aPos = gl.getAttribLocation(program, 'aPos'),
        aAges = gl.getAttribLocation(program, 'aAges'),
        uView = gl.getUniformLocation(program, 'view'),
        uProjection = gl.getUniformLocation(program, 'projection');


    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    let delta = 0,
        pt = 0;
    function render(t) {
        for (let i = 0; i < numNodes; i ++) {
            step(nodes[i * 2], nodes[i * 2 + 1]);
            addVerts(nodes[i * 2], nodes[i * 2 + 1], i);
        }

        cam.setView();

        const fullPositions = [];
        for (let i = 0; i < numNodes; i ++) fullPositions.push(...positions[i]);
        
        // Binds position attribute
        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fullPositions), gl.STATIC_DRAW);
        
        gl.vertexAttribPointer(
            aPos,
            3,
            gl.FLOAT,
            false,
            0,
            0,
        );
        
        gl.enableVertexAttribArray(aPos);

        // Calculates ages
        const ages = new Float32Array(positions[0].length * numNodes);
        for (let i = 0; i < fullPositions.length / 3; i ++) {
            ages[i] = (i % (positions[0].length / 3)) / (positions[0].length / 3);
        }

        // Binds age attributes
        const ageBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ageBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, ages, gl.STATIC_DRAW);
        gl.vertexAttribPointer(
            aAges,
            1,
            gl.FLOAT,
            false,
            0,
            0,
        );
        gl.enableVertexAttribArray(aAges);


        // Clears screen
        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Creates perspective projection matrix
        const ppm = mat4.create();
        mat4.perspective(ppm, 75*Math.PI/180, window.innerWidth / window.innerHeight, 0.1, 1000);


        let rotMat = vec3.fromValues(0, 0, 1);
        vec3.rotateX(rotMat, rotMat, zeroVec, cam.rotX);
        vec3.rotateY(rotMat, rotMat, zeroVec, cam.rotY);
        
        const lookAt = mat4.create();
        mat4.lookAt(lookAt, cam.pos, vec3.add(vec3.create(), cam.pos, rotMat), cam.up);

        gl.uniformMatrix4fv(uProjection, false, ppm);
        gl.uniformMatrix4fv(uView, false, lookAt);

        gl.drawArrays(gl.TRIANGLES, 0, fullPositions.length / 3);
        
        dt = t - pt;
        if (dt > 40) dt = 40; // Prevents excessively large time steps
        pt = t;

        window.requestAnimationFrame(render);
    }

    fetch('nodes.json').then(result => {
        result.json().then(nodesStr => {
            parseNodes(nodesStr);
            render(document.timeline.currentTime);
        }, () => console.log('Could not parse JSON')); // This should never happen
    }, reason => {
        console.log('Could not fetch nodes.json:', 'reason');
    })
}
main();