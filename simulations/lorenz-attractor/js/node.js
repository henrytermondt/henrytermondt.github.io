let numNodes = null;
const nodes = [],
    nodeSpeed = 0.0005;


const parseNodes = arr => {
    for (const node of arr) {
        nodes.push(vec3.fromValues(node[0], node[1], node[2]));
    }

    numNodes = arr.length / 2;

    for (let i = 0; i < numNodes; i ++) {
        positions.push([]);
    }
};

function step(node, lastNode) {
    node[0] += (sigma * (node[1] - node[0])) * nodeSpeed * dt;
    node[1] += (node[0] * (ro - node[2]) - node[1]) * nodeSpeed * dt;
    node[2] += (node[0] * node[1] - beta * node[2]) * nodeSpeed * dt;
}