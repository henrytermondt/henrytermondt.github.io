#version 300 es
precision highp float;

uniform sampler2D points;
uniform vec2 pointsDim;

uniform sampler2D tree;
uniform vec2 treeDim;

vec2 getTreeCoords(int index) {
    float i = float(index);
    return vec2(
        mod(i, treeDim.x) + 0.5,
        floor(i / treeDim.x) + 0.5
    ) / treeDim;
}
vec2 getTreeCoords(float index) {
    return vec2(
        mod(index, treeDim.x) + 0.5,
        floor(index / treeDim.x) + 0.5
    ) / treeDim;
}

vec2 getPointCoords(int index) {
    float i = float(index);
    return vec2(
        mod(i, pointsDim.x) + 0.5,
        floor(i / pointsDim.x) + 0.5
    ) / pointsDim;
}
vec2 getPointCoords(float index) {
    return vec2(
        mod(index, pointsDim.x) + 0.5,
        floor(index / pointsDim.x) + 0.5
    ) / pointsDim;
}


const float G = 0.000000001,
    dt = 0.5,
    theta = 0.5;

/*
x, y, width, state (0=empty, 1=point, 2=quadrants)
children/points (four indices)
cx, cy, mass
*/

int[64] qPtrs;
vec2 getAcceleration(vec2 pos) {
    vec2 a = vec2(0, 0); // Acceleration starts at  zero
    
    qPtrs[0] = 0; // Look at the root first
    int last = 0; //

    int iter = 1000;
    while (last >= 0 && iter > 0) {
        iter --;

        int index = qPtrs[last];
        last --; // Say that the most recent one is checked

        vec4 p1 = texture(tree, getTreeCoords(index));

        float state = p1.w;
        if (state == 0.0) {
            // last --;
            continue; // Contributes no force
        }
        
        vec4 p2 = texture(tree, getTreeCoords(index + 1)),
            p3 = texture(tree, getTreeCoords(index + 2));
        
        if (state == 1.0) { // Has point
            vec2 pos2 = texture(points, getPointCoords(p2.x)).xy;

            if (pos != pos2) { // If not itself
                vec2 d = pos2 - pos;
                if (d.x != 0.0 || d.y != 0.0) {
                    float r2 = d.x * d.x + d.y * d.y + 0.01;
                    r2 *= r2;
                    float c = G * p3.z / r2; // Gm / r^2
                    a += c * d;
                }
            }

            // last --;
        } else { // Has child quadrants
            vec2 d = p3.xy - pos;
            if (d.x != 0.0 || d.y != 0.0) {
                float r2 = d.x * d.x + d.y * d.y + 0.01; // Use center of mass
                if (p1.z * p1.z / r2 < theta * theta) { // Add force
                    r2 *= r2;
                    float c = G * p3.z / r2;//G * p3.z / r2; // Gm / r^2
                    a += d * c;// * 0.0001;//c * d;
                } else { // Recursively go through child quadrants
                    qPtrs[last + 1] = int(p2.x);
                    qPtrs[last + 2] = int(p2.y);
                    qPtrs[last + 3] = int(p2.z);
                    qPtrs[last + 4] = int(p2.w);

                    last += 4;
                }
            }
        }
    }

    // vec4 p1 = texture(tree, getTreeCoords(0));
    // vec4 p2 = texture(tree, getTreeCoords(0 + 1));
    // vec4 p3 = texture(tree, getTreeCoords(0 + 2));

    // if (p1.w == 0.0) a = vec2(0.0001, 0.0001);
    // else a = vec2(-0.0001, -0.0001);
    // a = vec2(0, 0);

    return a;
}

out vec4 color;
void main() {
    vec4 point = texture(points, gl_FragCoord.xy / pointsDim);
    
    point.zw += getAcceleration(point.xy) * dt;
    point.xy += point.zw * dt;

    color = point;
}