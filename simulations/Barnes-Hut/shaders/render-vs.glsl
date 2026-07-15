#version 300 es

in float id;

uniform sampler2D points;
uniform vec2 pointsDim;

void main() {
    vec2 tpos = vec2(mod(id, pointsDim.x), floor(id / pointsDim.x));

    vec4 point = texture(points, tpos / pointsDim);

    gl_Position = vec4((point.xy * 2.0 - 1.0) * vec2(1, -1), 0, 1);
    gl_PointSize = 1.0;
}