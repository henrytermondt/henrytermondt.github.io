const positions = [];

// Rotates around an arbitrary axis (didn't want to deal with quaternions)
const rot = (out, vec, axis, theta) => {
    const ct = Math.cos(theta),
        st = Math.sin(theta);
    const c = vec3.cross(vec3.create(), axis, vec),
        dot = vec3.dot(axis, vec);
    out[0] = vec[0] * ct + c[0] * st + axis[0] * (dot) * (1 - ct);
    out[1] = vec[1] * ct + c[1] * st + axis[1] * (dot) * (1 - ct);
    out[2] = vec[2] * ct + c[2] * st + axis[2] * (dot) * (1 - ct);
    return out;
};

// Makes a triangular tube following the path of the node
function addVerts(node, lastNode, id, follow = false) {
    const dirVec = vec3.sub(vec3.create(), node, lastNode);
    vec3.normalize(dirVec, dirVec);
    const normal = vec3.cross(vec3.create(), dirVec, upVec);
    vec3.normalize(normal, normal);

    vec3.scale(normal, normal, 0.1);

    const tri1 = {
        a: vec3.add(vec3.create(), lastNode, normal),
    };
    const tri2 = {
        a: vec3.add(vec3.create(), node, normal),
    };

    rot(normal, normal, dirVec, 2 / 3 * Math.PI);
    tri1.b = vec3.add(vec3.create(), lastNode, normal);
    tri2.b = vec3.add(vec3.create(), node, normal);

    rot(normal, normal, dirVec, 2 / 3 * Math.PI);
    tri1.c = vec3.add(vec3.create(), lastNode, normal);
    tri2.c = vec3.add(vec3.create(), node, normal);

    // Creates vertices
    positions[id].push(
        // Face 1
        tri1.a[0], tri1.a[1], tri1.a[2],
        tri2.a[0], tri2.a[1], tri2.a[2],
        tri2.b[0], tri2.b[1], tri2.b[2],
        tri2.b[0], tri2.b[1], tri2.b[2],
        tri1.b[0], tri1.b[1], tri1.b[2],
        tri1.a[0], tri1.a[1], tri1.a[2],

        // Face 2
        tri2.a[0], tri2.a[1], tri2.a[2],
        tri1.a[0], tri1.a[1], tri1.a[2],
        tri2.c[0], tri2.c[1], tri2.c[2],
        tri1.c[0], tri1.c[1], tri1.c[2],
        tri2.c[0], tri2.c[1], tri2.c[2],
        tri1.a[0], tri1.a[1], tri1.a[2],

        // Face 3
        tri1.b[0], tri1.b[1], tri1.b[2],
        tri2.b[0], tri2.b[1], tri2.b[2],
        tri2.c[0], tri2.c[1], tri2.c[2],
        tri2.c[0], tri2.c[1], tri2.c[2],
        tri1.c[0], tri1.c[1], tri1.c[2],
        tri1.b[0], tri1.b[1], tri1.b[2],
    );
    vec3.copy(lastNode, node);
    if (positions[id].length > maxVerts * 18 * 3) positions[id].splice(0, 3 * 18);
}